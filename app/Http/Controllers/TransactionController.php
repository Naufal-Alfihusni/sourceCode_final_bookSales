<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'book'])->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resources transaction no found!",
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get all resources transaction",
            "data" => $transactions,
        ], 200);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user('api');
        $query = Transaction::with(['user', 'book'])->whereKey($id);

        // pelanggan hanya dapat melihat transaksi miliknya
        // admin dapat melihat semua transaksi
        if ($user->role !== 'admin') {
            $query->where('customer_id', $user->id);
        }

        $transaction = $query->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Get detail resource',
            'data' => $transaction
        ], 200);
    }

    public function store(Request $request)
    {
        //validator
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|integer|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        //cek validator
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ], 422);
        }

        //ambil user yang sedang login
        $user = $request->user('api');
        $validated = $validator->validated();
        $quantity = (int) $validated['quantity'];

        //generate order number
        $orderNumber = 'ORD-' . strtoupper(Str::uuid()->toString());

        //stok dan transaksi disimpan dalam satu database transaction
        return DB::transaction(function () use ($validated, $user, $quantity, $orderNumber) {
            //mengunci stok agar tidak dipakai bersamaan oleh transaksi lain
            $book = Book::query()
                ->lockForUpdate()
                ->find($validated['book_id']);

            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }

            //cek stok buku
            if ($book->stock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock barang tidak cukup!'
                ], 400);
            }

            //hitung total harga dari harga buku di database
            $totalAmount = number_format((float) $book->price * $quantity, 2, '.', '');

            //kurangi stok buku
            $book->decrement('stock', $quantity);

            //simpan data transaksi
            $transaction = Transaction::create([
                'order_number' => $orderNumber,
                'customer_id' => $user->id,
                'book_id' => $book->id,
                'quantity' => $quantity,
                'total_amount' => $totalAmount,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction
            ], 201);
        });
    }

    public function update(Request $request, string $id)
    {
        //validator
        $validator = Validator::make($request->all(), [
            'book_id' => 'required|integer|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        //cek validator
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        $quantity = (int) $validated['quantity'];

        //update stok dan transaksi dalam satu database transaction
        return DB::transaction(function () use ($id, $validated, $quantity) {
            $transaction = Transaction::query()
                ->lockForUpdate()
                ->find($id);

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found'
                ], 404);
            }

            //mengunci buku berdasarkan urutan ID untuk mengurangi risiko deadlock
            $books = Book::query()
                ->whereIn('id', [(int) $transaction->book_id, (int) $validated['book_id']])
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $previousBook = $books->get($transaction->book_id);
            $newBook = $books->get($validated['book_id']);

            if (!$previousBook || !$newBook) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }

            //hitung stok yang tersedia setelah jumlah transaksi lama dikembalikan
            $availableStock = $newBook->stock;

            if ($previousBook->is($newBook)) {
                $availableStock += $transaction->quantity;
            }

            if ($availableStock < $quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock barang tidak cukup!'
                ], 400);
            }

            //jika buku sama, sesuaikan stok dengan jumlah transaksi yang baru
            //jika buku berubah, kembalikan stok lama dan kurangi stok buku baru
            if ($previousBook->is($newBook)) {
                $newBook->stock = $availableStock - $quantity;
                $newBook->save();
            } else {
                $previousBook->increment('stock', $transaction->quantity);
                $newBook->decrement('stock', $quantity);
            }

            $transaction->update([
                'book_id' => $newBook->id,
                'quantity' => $quantity,
                'total_amount' => number_format((float) $newBook->price * $quantity, 2, '.', ''),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'data' => $transaction->load(['user', 'book'])
            ], 200);
        });
    }

    public function destroy(string $id)
    {
        //hapus transaksi dan kembalikan stok dalam satu database transaction
        return DB::transaction(function () use ($id) {
            $transaction = Transaction::query()
                ->lockForUpdate()
                ->find($id);

            if (!$transaction) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resource not found'
                ], 404);
            }

            $book = Book::query()
                ->lockForUpdate()
                ->find($transaction->book_id);

            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }

            //kembalikan stok buku sesuai jumlah transaksi
            $book->increment('stock', $transaction->quantity);
            $transaction->delete();

            return response()->json([
                'success' => true,
                'message' => 'Transaction deleted successfully'
            ], 200);
        });
    }
}
