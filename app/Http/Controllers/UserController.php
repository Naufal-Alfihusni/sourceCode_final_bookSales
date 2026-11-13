<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resources books no found!",
            ], 200);
        }


        return response()->json([
            "success" => true,
            "message" => "Get all resources",
            "data" => $users,
        ], 200);
    }

    public function show(User $user): JsonResponse
    {
        // Hentikan request dengan respons 403 jika user login bukan pemilik profil.
        Gate::authorize('view', $user);

        return response()->json([
            'success' => true,
            'message' => 'Get detail resource',
            'data' => $user
        ], 200);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        // Otorisasi harus dilakukan sebelum data target diubah.
        Gate::authorize('update', $user);

        // Hanya field yang divalidasi yang boleh diteruskan ke proses update.
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:255',
                // Email milik user ini tetap valid; email milik user lain harus unik.
                Rule::unique('users', 'email')->ignore($user),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
        ]);

        // Nilai null berarti email atau password tidak diganti, jadi pertahankan nilai lama.
        $validated = array_filter($validated, static fn ($value) => $value !== null);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Resource update successfully',
            'data' => $user->refresh()
        ], 200);
    }

    public function destroy(User $user): JsonResponse
    {
        // Policy mengizinkan admin menghapus siapa pun atau user menghapus akunnya sendiri.
        Gate::authorize('delete', $user);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Delete resource successfully'
        ]);
    }
}
