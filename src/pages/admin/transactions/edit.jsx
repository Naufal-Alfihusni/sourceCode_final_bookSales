import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  showTransaction,
  updateTransaction,
} from "../../../_services/transactions";
import { getBooks } from "../../../_services/books";
import { getUsers } from "../../../_services/users";

export default function TransactionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    order_number: "",
    book_id: 0,
    customer_id: 0,
    quantity: 1,
    total_amount: "",
    _method: "PUT",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [transactionData, bookData, userData] = await Promise.all([
        showTransaction(id),
        getBooks(),
        getUsers(),
      ]);
      setFormData({
        order_number: transactionData.order_number,
        book_id: transactionData.book_id,
        customer_id: transactionData.customer_id,
        quantity: transactionData.quantity,
        total_amount: transactionData.total_amount,
        _method: "PUT",
      });
      setBooks(bookData.data);
      setUsers(userData.data);
    };
    fetchData();
  }, [id]);

  const getCustomerName = () => {
    const user = users.find(
      (user) => String(user.id) === String(formData.customer_id),
    );
    return user ? user.name : "Unknown Customer";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      await updateTransaction(id, payload);
      navigate("/admin/transactions");
    } catch (error) {
      console.log(error);
      alert("Failed to update transaction.");
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Transaction
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="order_number"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Order Number
                </label>
                <input
                  type="text"
                  name="order_number"
                  id="order_number"
                  value={formData.order_number}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="Order Number"
                  readOnly
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="book_id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Book
                </label>
                <select
                  id="book_id"
                  name="book_id"
                  value={formData.book_id}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                >
                  <option value="">-- Select Book --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="customer_id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Customer
                </label>
                <input
                  type="text"
                  name="customer_id"
                  id="customer_id"
                  value={getCustomerName()}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  placeholder="Customer Name"
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min={1}
                  value={formData.quantity}
                  onChange={handleChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="total_amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Total Amount
                </label>
                <input
                  type="number"
                  id="total_amount"
                  name="total_amount"
                  min="0"
                  value={formData.total_amount}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  readOnly
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
