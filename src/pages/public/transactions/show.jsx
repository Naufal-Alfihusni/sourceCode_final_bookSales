import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { showTransaction } from "../../../_services/transactions";
import { getBooks } from "../../../_services/books";
import { showUser } from "../../../_services/users";

// Ganti nomor placeholder ini dengan nomor WhatsApp Dami.
const whatsappLink = "https://wa.me/628xxxxxxxxxx";

export default function ShowTransaction() {
  const { id } = useParams();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [copiedOrderNumber, setCopiedOrderNumber] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setTransactions([]);
      setBooks([]);
      setCustomer(null);
      setError("");
      setLookupError("");

      try {
        const transactionData = location.state?.transactions?.length
          ? location.state.transactions
          : [await showTransaction(id)];

        if (isMounted) {
          setTransactions(transactionData);
        }

        const [booksResult, customerResult] = await Promise.allSettled([
          getBooks(),
          showUser(transactionData[0].customer_id),
        ]);

        if (!isMounted) return;

        if (booksResult.status === "fulfilled") {
          setBooks(booksResult.value.data);
        } else {
          setLookupError(
            booksResult.reason?.response?.data?.message ||
              booksResult.reason?.message ||
              "Failed to load book details.",
          );
        }

        if (customerResult.status === "fulfilled") {
          setCustomer(customerResult.value);
        } else {
          setLookupError(
            customerResult.reason?.response?.data?.message ||
              customerResult.reason?.message ||
              "Failed to load customer details.",
          );
        }
      } catch (requestError) {
        if (!isMounted) return;

        console.log(requestError);
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Failed to load transaction details.",
        );
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  const getBookName = (bookId) => {
    const book = books.find((book) => String(book.id) === String(bookId));
    return book ? book.title : "Unknown Book";
  };

  const getCustomerName = (customerId) =>
    String(customer?.id) === String(customerId)
      ? customer.name
      : "Unknown Customer";

  const handleCopyOrderNumber = async (orderNumber) => {
    try {
      await navigator.clipboard.writeText(String(orderNumber));
      setCopiedOrderNumber(orderNumber);
    } catch (copyError) {
      console.log(copyError);
      alert("Gagal menyalin nomor order.");
    }
  };

  const orderNumbers = transactions
    .map((transaction) => transaction.order_number)
    .filter(Boolean)
    .join(", ");
  const message = `Halo, saya ingin mengirim alamat pengiriman dan bukti transfer untuk transaksi ${orderNumbers}.`;

  return (
    <section className="flex-1 bg-gray-50 py-8 dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Detail Transaksi
        </h1>

        {error ? (
          <p role="alert" className="text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Order Number
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Book
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Customer
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{transaction.order_number}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyOrderNumber(transaction.order_number)
                            }
                            disabled={!transaction.order_number}
                            aria-label={`Salin nomor order ${transaction.order_number}`}
                            className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {copiedOrderNumber === transaction.order_number
                              ? "Tersalin"
                              : "Salin"}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getBookName(transaction.book_id)}
                      </td>
                      <td className="px-4 py-3">
                        {getCustomerName(transaction.customer_id)}
                      </td>
                      <td className="px-4 py-3">{transaction.quantity}</td>
                      <td className="px-4 py-3">
                        Rp {transaction.total_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {lookupError && (
              <p role="alert" className="mt-4 text-red-600 dark:text-red-400">
                {lookupError}
              </p>
            )}

            {location.state?.message && (
              <p
                role="alert"
                className="mt-4 text-amber-700 dark:text-amber-400"
              >
                {location.state.message}
              </p>
            )}

            <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-200">
                Silakan kirim order number, alamat pengiriman dan bukti transfer
                melalui chat di bawah ini.
              </p>
              <a
                href={`${whatsappLink}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Chat WhatsApp
              </a>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            Data transaksi tidak ditemukan.
          </p>
        )}

        <Link
          to="/books"
          className="mt-6 inline-block text-indigo-700 hover:underline dark:text-indigo-400"
        >
          Kembali ke daftar buku
        </Link>
      </div>
    </section>
  );
}
