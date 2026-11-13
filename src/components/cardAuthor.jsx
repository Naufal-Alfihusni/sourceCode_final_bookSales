import { useEffect, useState } from "react";
import { getAuthors } from "../_services/authors";
import { Link } from "react-router-dom";
import { authorImageStore } from "../_api";

export default function CardAuthor({ showAll = false }) {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [authorsData] = await Promise.all([getAuthors()]);
        if (isMounted) {
          setAuthors(authorsData.data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError?.response?.data?.message ||
              "Gagal memuat daftar author.",
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

  const displayedAuthors = showAll ? authors : authors.slice(0, 4);

  return (
    <section className="bg-gray-50 py-8 dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showAll ? "All Authors" : "Author BookSales"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kenali para penulis yang karyanya tersedia di BookSales.
          </p>
        </div>

        {error ? (
          <p role="alert" className="text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : isLoading ? (
          <p className="text-gray-600 dark:text-gray-400">
            Memuat daftar author...
          </p>
        ) : displayedAuthors.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
              {displayedAuthors.map((author) => (
                <article
                  key={author.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="h-56 w-full bg-gray-100 dark:bg-gray-700">
                    {author.photo ? (
                      <img
                        className="h-full w-full object-cover"
                        src={`${authorImageStore}/${author.photo}`}
                        alt={`Foto ${author.name}`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                        Foto tidak tersedia
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {author.name}
                    </h3>
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600 dark:text-gray-400">
                      {author.bio || "Bio author belum tersedia."}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            {!showAll && authors.length > 4 && (
              <div className="mt-8 text-center">
                <Link
                  to="/authors"
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                >
                  See More
                </Link>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Belum ada author yang terdaftar.
          </p>
        )}
      </div>
    </section>
  );
}
