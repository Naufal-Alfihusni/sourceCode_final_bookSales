import { useEffect, useState } from "react";
import { getBooks } from "../_services/books";
import { Link } from "react-router-dom";
import { bookImageStore } from "../_api";

export default function Hero() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData] = await Promise.all([getBooks()]);
        setBooks(booksData.data);
      } catch (requestError) {
        console.log(requestError);
        setError(
          requestError?.response?.data?.message ||
            "Gagal memuat buku pilihan.",
        );
      }
    };

    fetchData();
  }, []);

  const book = books[0];

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center lg:px-12 lg:py-20">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
            Buku Pilihan
          </p>

          {error ? (
            <p role="alert" className="text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : book ? (
            <>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
                {book.title}
              </h1>
              <p className="mb-4 text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                Rp {book.price}
              </p>
              <p className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                {book.description}
              </p>
              <Link
                to={`/books/show/${book.id}`}
                className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Lihat Detail
                <svg
                  className="ml-2 h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No books found.</p>
          )}
        </div>

        {book?.cover_photo && (
          <div className="mx-auto w-full max-w-md">
            <img
              className="h-[28rem] w-full rounded-lg object-contain shadow-lg"
              src={`${bookImageStore}/${book.cover_photo}`}
              alt={`Sampul buku ${book.title}`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
