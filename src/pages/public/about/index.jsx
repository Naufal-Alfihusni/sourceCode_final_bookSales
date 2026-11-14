import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import logoDark from "../../../assets/logo_dark.png";
import logoTextDark from "../../../assets/logo_teks_dark.png";
import logoTextWhite from "../../../assets/logo_teks_white.png";

export default function AboutUs() {
  return (
    <section className=" bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <img
            className="mx-auto mb-6 h-auto w-full max-w-64 object-contain sm:max-w-80 dark:hidden"
            src={logo}
            alt="MYbookSales Logo"
          />
          <img
            className="mx-auto mb-6 hidden h-auto w-full max-w-64 object-contain sm:max-w-80 dark:block"
            src={logoDark}
            alt="MYbookSales Logo"
          />
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
            Tentang Kami
          </p>
          <h1 className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">
            <span>Selamat datang di</span>
            <span className="inline-flex items-center">
              <img
                className="h-auto w-48 max-w-full object-contain sm:w-56 md:w-64 dark:hidden"
                src={logoTextWhite}
                alt="MYbookSales"
              />
              <img
                className="hidden h-auto w-48 max-w-full object-contain sm:w-56 md:w-64 dark:block"
                src={logoTextDark}
                alt="MYbookSales"
              />
            </span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            MYbookSales adalah tempat untuk menjelajahi berbagai pilihan buku,
            mengenal penulis, dan menemukan bacaan yang sesuai dengan minatmu.
            Kami ingin membuat pengalaman mencari dan membeli buku menjadi lebih
            mudah.
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
