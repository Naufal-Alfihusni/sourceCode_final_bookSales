import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../../_services/authors";
import { getBooks } from "../../_services/books";
import { getGenres } from "../../_services/genres";
import { getTransactions } from "../../_services/transactions";
import { getUsers } from "../../_services/users";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [bookData, authorData, genreData, userData, transactionData] =
          await Promise.all([
            getBooks(),
            getAuthors(),
            getGenres(),
            getUsers(),
            getTransactions(),
          ]);

        if (isMounted) {
          setCounts({
            books: bookData.data.length,
            authors: authorData.data.length,
            genres: genreData.data.length,
            users: userData.data.length,
            transactions: transactionData.length,
          });
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError?.response?.data?.message ||
              "Failed to load dashboard data.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = counts
    ? [
        { label: "Books", count: counts.books, to: "/admin/books" },
        { label: "Authors", count: counts.authors, to: "/admin/authors" },
        { label: "Genres", count: counts.genres, to: "/admin/genres" },
        { label: "Users", count: counts.users, to: "/admin/users" },
        {
          label: "Transactions",
          count: counts.transactions,
          to: "/admin/transactions",
        },
      ]
    : [];

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>

        {error && (
          <p role="alert" className="mb-4 text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading dashboard data...
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className="rounded-lg bg-white p-5 shadow hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.label}
                </h2>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {card.count}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-indigo-700 dark:text-indigo-400">
                  View {card.label.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
