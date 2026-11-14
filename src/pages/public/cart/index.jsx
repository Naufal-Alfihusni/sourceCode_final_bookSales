import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookImageStore } from "../../../_api";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../../../_services/cart";
import { createTransaction } from "../../../_services/transactions";

export default function Cart() {
  const [cart, setCart] = useState(() => getCart());
  const navigate = useNavigate();

  useEffect(() => {
    // Sinkronkan isi keranjang setelah perubahan dari halaman lain atau tab lain.
    const updateCart = () => setCart(getCart());

    window.addEventListener("cartUpdated", updateCart);
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const totalAmount = cart.reduce(
    (total, book) => total + Number(book.price) * book.quantity,
    0,
  );

  const handleQuantityChange = (book, quantity) => {
    updateCartQuantity(book.id, quantity);
  };

  const handleCheckout = async () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    const successfulTransactions = [];

    try {
      // Proses satu per satu agar item hanya dihapus setelah transaksi berhasil.
      for (const book of cart) {
        const response = await createTransaction({
          book_id: book.id,
          quantity: book.quantity,
        });
        const transaction =
          response?.data?.data ||
          response?.data?.transaction ||
          response?.data ||
          response;

        if (!transaction?.id) {
          throw new Error("Transaction details are unavailable.");
        }

        successfulTransactions.push(transaction);
        removeFromCart(book.id);
      }

      navigate(`/transactions/show/${successfulTransactions[0].id}`, {
        state: { transactions: successfulTransactions },
      });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        "Gagal memproses transaksi. Silakan coba kembali.";

      if (successfulTransactions.length > 0) {
        navigate(`/transactions/show/${successfulTransactions[0].id}`, {
          state: {
            transactions: successfulTransactions,
            message: `${successfulTransactions.length} transaksi berhasil. ${errorMessage} Item yang belum berhasil masih ada di keranjang.`,
          },
        });
        return;
      }

      alert(errorMessage);
    }
  };

  return (
    <section className="flex-1 bg-gray-50 py-8 dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Keranjang Belanja
        </h1>

        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map((book) => (
              <article
                key={book.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800"
              >
                <img
                  src={`${bookImageStore}/${book.cover_photo}`}
                  alt={book.title}
                  className="h-32 w-24 self-center object-contain sm:self-auto"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Rp {book.price}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Jumlah
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(book, book.quantity - 1)
                      }
                      disabled={book.quantity <= 1}
                      aria-label={`Kurangi jumlah ${book.title}`}
                      className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {book.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(book, book.quantity + 1)
                      }
                      disabled={book.quantity >= book.stock}
                      aria-label={`Tambah jumlah ${book.title}`}
                      className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(book.id)}
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Subtotal: Rp {Number(book.price) * book.quantity}
                </p>
              </article>
            ))}

            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
              >
                Kosongkan Keranjang
              </button>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  Total: Rp {totalAmount}
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Keranjang masih kosong.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              Jelajahi Buku
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
