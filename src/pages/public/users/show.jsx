import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { showUser } from "../../../_services/users";

export default function ShowUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;

      setUser(null);
      setError("");

      try {
        const userData = await showUser(id);
        if (!userData) {
          throw new Error("User profile not found.");
        }

        if (isMounted) {
          setUser(userData);
        }
      } catch (requestError) {
        if (!isMounted) return;

        console.log(requestError);
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Failed to load user profile.",
        );
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="bg-white dark:bg-gray-900 ">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16 min-h-screen">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          User Profile
        </h1>

        {error ? (
          <>
            <p role="alert" className="text-red-600 dark:text-red-400">
              {error}
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-indigo-700 hover:underline dark:text-indigo-400"
            >
              Back to Home
            </Link>
          </>
        ) : !user ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading user profile...
          </p>
        ) : (
          <>
            <dl className="space-y-5">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-white">
                  {user.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-white">
                  {user.email}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex items-center gap-3">
              <Link
                to={`/users/edit/${id}`}
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Edit Profile
              </Link>
              <Link
                to="/"
                className="text-gray-700 border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
