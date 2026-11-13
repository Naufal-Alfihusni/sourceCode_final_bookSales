<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

it('allows a user to view their own profile', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $this->actingAs($user, 'api')
        ->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $user->id);
});

it('forbids a user from viewing another profile', function () {
    $authenticatedUser = User::factory()->create(['role' => 'admin']);
    $targetUser = User::factory()->create(['role' => 'customer']);

    $this->actingAs($authenticatedUser, 'api')
        ->getJson("/api/users/{$targetUser->id}")
        ->assertForbidden();
});

it('allows a user to update their own profile', function () {
    $user = User::factory()->create(['role' => 'customer']);

    $this->actingAs($user, 'api')
        ->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'password' => 'new-password',
            'role' => 'admin',
        ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Name');

    expect($user->fresh()->name)->toBe('Updated Name')
        ->and($user->fresh()->role)->toBe('customer')
        ->and(Hash::check('new-password', $user->fresh()->password))->toBeTrue();
});

it('keeps the existing email and password when nullable fields are empty', function () {
    $user = User::factory()->create(['role' => 'customer']);
    $oldEmail = $user->email;
    $oldPassword = $user->password;

    $this->actingAs($user, 'api')
        ->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => null,
            'password' => null,
        ])
        ->assertOk()
        ->assertJsonPath('data.email', $oldEmail);

    expect($user->fresh()->password)->toBe($oldPassword);
});

it('forbids a user from updating another profile', function () {
    $authenticatedUser = User::factory()->create(['role' => 'admin']);
    $targetUser = User::factory()->create(['role' => 'customer']);

    $this->actingAs($authenticatedUser, 'api')
        ->putJson("/api/users/{$targetUser->id}", [
            'name' => 'Unauthorized Name',
        ])
        ->assertForbidden();

    expect($targetUser->fresh()->name)->not->toBe('Unauthorized Name');
});

it('allows a user to delete their own profile', function () {
    $user = User::factory()->create(['role' => 'customer']);

    $this->actingAs($user, 'api')
        ->deleteJson("/api/users/{$user->id}")
        ->assertOk();

    $this->assertModelMissing($user);
});

it('forbids a customer from deleting another profile', function () {
    $authenticatedUser = User::factory()->create(['role' => 'customer']);
    $targetUser = User::factory()->create(['role' => 'customer']);

    $this->actingAs($authenticatedUser, 'api')
        ->deleteJson("/api/users/{$targetUser->id}")
        ->assertForbidden();

    $this->assertModelExists($targetUser);
});

it('allows an admin to delete another profile', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $targetUser = User::factory()->create(['role' => 'customer']);

    $this->actingAs($admin, 'api')
        ->deleteJson("/api/users/{$targetUser->id}")
        ->assertOk();

    $this->assertModelMissing($targetUser);
});

it('requires authentication to access a profile', function () {
    $user = User::factory()->create(['role' => 'customer']);

    $this->getJson("/api/users/{$user->id}")
        ->assertUnauthorized();
});
