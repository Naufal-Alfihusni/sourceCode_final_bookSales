<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * User hanya boleh melihat profil miliknya sendiri.
     * Parameter pertama adalah user yang sedang login; parameter kedua adalah profil tujuan.
     */
    public function view(User $user, User $targetUser): bool
    {
        return $user->is($targetUser);
    }

    /**
     * User hanya boleh mengubah profil miliknya sendiri.
     */
    public function update(User $user, User $targetUser): bool
    {
        return $user->is($targetUser);
    }

    /**
     * Admin boleh menghapus profil siapa pun, sedangkan user biasa
     * hanya boleh menghapus profil miliknya sendiri.
     */
    public function delete(User $user, User $targetUser): bool
    {
        return $user->role === 'admin' || $user->is($targetUser);
    }
}
