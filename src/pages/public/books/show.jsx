import { useEffect, useState } from "react";
import { showBook } from "../../../_services/books";
import { useNavigate, useParams } from "react-router-dom";
import { bookImageStore } from "../../../_api";
import { createTransaction } from "../../../_services/transactions";
import { addToCart } from "../../../_services/cart";

export default function ShowBook() {
  const { id } = useParams();
  const [book, setBook] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [bookData] = await Promise.all([showBook(id)]);
      setBook(bookData);
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const payload = {
        book_id: id,
        quantity: quantity,
      };

      const response = await createTransaction(payload);
      const transaction =
        response?.data?.data ||
        response?.data?.transaction ||
        response?.data ||
        response;

      if (!transaction?.id) {
        throw new Error("Transaction details are unavailable.");
      }

      navigate(`/transactions/show/${transaction.id}`, {
        state: { transactions: [transaction] },
      });
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create transaction.",
      );
    }
  };

  const handleAddToCart = () => {
    const quantityToAdd = Number(quantity);

    if (!Number.isInteger(quantityToAdd) || quantityToAdd < 1) {
      alert("Jumlah buku harus minimal 1.");
      return;
    }

    if (!addToCart(book, quantityToAdd)) {
      alert("Jumlah buku melebihi stok yang tersedia.");
      return;
    }

    alert("Buku berhasil ditambahkan ke keranjang.");
  };

  return (
    <>
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <img
                className="w-full "
                src={`${bookImageStore}/${book.cover_photo}`}
                alt=""
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {book.title}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  Rp {book.price}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                    <svg
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                    (5.0)
                  </p>
                  <p className="text-sm font-medium leading-none text-gray-900 hover:no-underline dark:text-white">
                    345 Reviews
                  </p>
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:max-w-xs">
                      <label
                        htmlFor="quantity"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Jumlah
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        min={1}
                        max={book.stock}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Stok tersedia: {book.stock}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                    >
                      Beli Sekarang
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex w-full items-center justify-center rounded-lg border border-indigo-700 px-5 py-3 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-700 dark:focus:ring-indigo-800"
                    >
                      Tambah ke Keranjang
                    </button>
                  </div>
                </form>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                {book.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
