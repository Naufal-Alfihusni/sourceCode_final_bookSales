const testimonials = [
  {
    quote:
      "Saya mudah menemukan buku yang dicari. Informasi dan detail bukunya juga jelas.",
    name: "Rina",
  },
  {
    quote:
      "Pilihan bukunya beragam dan tampilannya memudahkan saya menemukan bacaan baru.",
    name: "Dimas",
  },
  {
    quote:
      "Saya bisa melihat detail buku sebelum memutuskan untuk membelinya. Praktis!",
    name: "Sari",
  },
];
export default function Testimonial() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-12 lg:px-6 lg:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kata pembeli BookSales
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Pengalaman pembeli saat menemukan buku favorit mereka.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <blockquote>
                  <p className="text-gray-700 dark:text-gray-300">
                    “{testimonial.quote}”
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      pembeli BookSales
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
