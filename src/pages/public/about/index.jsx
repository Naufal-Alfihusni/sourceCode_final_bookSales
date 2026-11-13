import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
            Tentang Kami
          </p>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
            Selamat datang di BookSales
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            BookSales adalah tempat untuk menjelajahi berbagai pilihan buku,
            mengenal penulis, dan menemukan bacaan yang sesuai dengan minatmu.
            Kami ingin membuat pengalaman mencari dan membeli buku menjadi
            lebih mudah.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          >
            Jelajahi Buku
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <article className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Pilihan Buku
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Jelajahi koleksi buku dan lihat informasi setiap buku sebelum
              menentukan pilihan.
            </p>
          </article>
          <article className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Kenali Penulis
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Temukan informasi tentang penulis dan karya yang tersedia di
              BookSales.
            </p>
          </article>
          <article className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              Pengalaman Praktis
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Gunakan BookSales untuk menelusuri buku dan melihat detailnya
              dalam satu tempat.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
