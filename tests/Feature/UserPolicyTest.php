<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

it('allows profile abilities only for the profile owner', function (string $ability, bool $isOwner) {
    $targetUser = User::factory()->create(['role' => 'customer']);
    $authenticatedUser = $isOwner
        ? $targetUser
        : User::factory()->create(['role' => 'customer']);

    expect(Gate::forUser($authenticatedUser)->allows($ability, $targetUser))
        ->toBe($isOwner);
})->with([
    'owner can view own profile' => ['view', true],
    'another user cannot view the profile' => ['view', false],
    'owner can update own profile' => ['update', true],
    'another user cannot update the profile' => ['update', false],
    'owner can delete own profile' => ['delete', true],
    'another user cannot delete the profile' => ['delete', false],
]);

it('allows an admin to delete another users profile', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $targetUser = User::factory()->create(['role' => 'customer']);

    expect(Gate::forUser($admin)->allows('delete', $targetUser))->toBeTrue();
});
