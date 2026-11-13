<?php

use App\Models\Author;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

uses(RefreshDatabase::class);

function transactionTestBook(int $stock, string $price = '10.00'): Book
{
    $genre = Genre::create([
        'name' => Str::uuid()->toString(),
        'description' => 'Genre for transaction test',
    ]);

    $author = Author::create([
        'name' => Str::uuid()->toString(),
        'photo' => 'author.jpg',
        'bio' => 'Author for transaction test',
    ]);

    return Book::create([
        'title' => Str::uuid()->toString(),
        'description' => 'Book for transaction test',
        'price' => $price,
        'stock' => $stock,
        'cover_photo' => 'book.jpg',
        'genre_id' => $genre->id,
        'author_id' => $author->id,
    ]);
}

function transactionTestRecord(User $user, Book $book, int $quantity): Transaction
{
    return Transaction::create([
        'order_number' => 'ORD-' . Str::uuid()->toString(),
        'customer_id' => $user->id,
        'book_id' => $book->id,
        'quantity' => $quantity,
        'total_amount' => (float) $book->price * $quantity,
    ]);
}

function transactionTestToken(User $user): string
{
    config(['jwt.secret' => 'transaction-feature-test-secret']);

    return JWTAuth::fromUser($user);
}

it('creates a transaction and decreases stock by the requested quantity', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $book = transactionTestBook(10, '12.50');

    $this->actingAs($user, 'api')
        ->postJson('/api/transactions', [
            'book_id' => $book->id,
            'quantity' => 3,
        ])
        ->assertCreated()
        ->assertJsonPath('data.quantity', 3)
        ->assertJsonPath('data.total_amount', '37.50');

    $this->assertDatabaseHas('transactions', [
        'customer_id' => $user->id,
        'book_id' => $book->id,
        'quantity' => 3,
        'total_amount' => '37.50',
    ]);
    expect($book->fresh()->stock)->toBe(7);
});

it('rejects a purchase when stock is insufficient without changing data', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $book = transactionTestBook(2);

    $this->actingAs($user, 'api')
        ->postJson('/api/transactions', [
            'book_id' => $book->id,
            'quantity' => 3,
        ])
        ->assertBadRequest();

    expect($book->fresh()->stock)->toBe(2);
    $this->assertDatabaseCount('transactions', 0);
});

it('rejects a transaction with a non-positive quantity', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $book = transactionTestBook(10);

    $this->actingAs($user, 'api')
        ->postJson('/api/transactions', [
            'book_id' => $book->id,
            'quantity' => 0,
        ])
        ->assertUnprocessable()
        ->assertJsonPath('message', 'Validation error')
        ->assertJsonStructure(['data' => ['quantity']]);

    expect($book->fresh()->stock)->toBe(10);
    $this->assertDatabaseCount('transactions', 0);
});

it('updates quantity and adjusts stock correctly for the same book', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $book = transactionTestBook(8);
    $transaction = transactionTestRecord(User::factory()->create(['role' => 'customer']), $book, 2);

    $this->withHeader('Authorization', 'Bearer ' . transactionTestToken($admin))
        ->putJson("/api/transactions/{$transaction->id}", [
            'book_id' => $book->id,
            'quantity' => 5,
        ])
        ->assertOk()
        ->assertJsonPath('data.quantity', 5)
        ->assertJsonPath('data.total_amount', '50.00');

    expect($book->fresh()->stock)->toBe(5);
    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'quantity' => 5,
        'total_amount' => '50.00',
    ]);
});

it('returns old stock and reserves new stock when changing the book on a transaction', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customer = User::factory()->create(['role' => 'customer']);
    $oldBook = transactionTestBook(8);
    $newBook = transactionTestBook(10, '15.00');
    $transaction = transactionTestRecord($customer, $oldBook, 2);

    $this->withHeader('Authorization', 'Bearer ' . transactionTestToken($admin))
        ->putJson("/api/transactions/{$transaction->id}", [
            'book_id' => $newBook->id,
            'quantity' => 3,
        ])
        ->assertOk()
        ->assertJsonPath('data.book_id', $newBook->id)
        ->assertJsonPath('data.quantity', 3)
        ->assertJsonPath('data.total_amount', '45.00');

    expect($oldBook->fresh()->stock)->toBe(10)
        ->and($newBook->fresh()->stock)->toBe(7);
});

it('keeps the transaction and both stocks unchanged if an update cannot be fulfilled', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customer = User::factory()->create(['role' => 'customer']);
    $oldBook = transactionTestBook(8);
    $newBook = transactionTestBook(2);
    $transaction = transactionTestRecord($customer, $oldBook, 2);

    $this->withHeader('Authorization', 'Bearer ' . transactionTestToken($admin))
        ->putJson("/api/transactions/{$transaction->id}", [
            'book_id' => $newBook->id,
            'quantity' => 3,
        ])
        ->assertBadRequest();

    expect($oldBook->fresh()->stock)->toBe(8)
        ->and($newBook->fresh()->stock)->toBe(2);
    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'book_id' => $oldBook->id,
        'quantity' => 2,
    ]);
});

it('restores the purchased quantity when deleting a transaction', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $customer = User::factory()->create(['role' => 'customer']);
    $book = transactionTestBook(7);
    $transaction = transactionTestRecord($customer, $book, 3);

    $this->withHeader('Authorization', 'Bearer ' . transactionTestToken($admin))
        ->deleteJson("/api/transactions/{$transaction->id}")
        ->assertOk();

    expect($book->fresh()->stock)->toBe(10);
    $this->assertModelMissing($transaction);
});

it('allows a customer to view only their own transaction', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $anotherCustomer = User::factory()->create(['role' => 'customer']);
    $book = transactionTestBook(10);
    $ownTransaction = transactionTestRecord($customer, $book, 1);
    $otherTransaction = transactionTestRecord($anotherCustomer, $book, 1);

    $this->actingAs($customer, 'api')
        ->getJson("/api/transactions/{$ownTransaction->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $ownTransaction->id);

    $this->getJson("/api/transactions/{$otherTransaction->id}")
        ->assertNotFound();
});
