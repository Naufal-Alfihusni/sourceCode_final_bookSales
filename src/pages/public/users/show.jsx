import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUser, showUser } from "../../../_services/users";

export default function ShowUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;

      setUsers(null);
      setError("");

      try {
        const usersData = await showUser(id);
        if (!usersData) {
          throw new Error("User profile not found.");
        }

        if (isMounted) {
          setUsers(usersData);
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

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Apakah yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.",
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      navigate("/", { replace: true });
    } catch (requestError) {
      console.log(requestError);
      window.alert(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Failed to delete user account.",
      );
    }
  };

  return (
    <section className="flex-1 bg-white dark:bg-gray-900 ">
      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
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
        ) : !users ? (
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
                  {users.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="mt-1 text-base text-gray-900 dark:text-white">
                  {users.email}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/users/edit/${id}`}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Edit Profile
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              >
                Back to Home
              </Link>
            </div>
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-red-800 dark:text-red-300">
                    Zona berbahaya
                  </h2>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    Hapus akun secara permanen. Kamu akan keluar setelah akun
                    berhasil dihapus.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(users.id)}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-900 sm:w-auto"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12m-10 0 .7 12h6.6L16 7M9 7V4h6v3m-5 4v5m4-5v5"
                    />
                  </svg>
                  Hapus Akun
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
