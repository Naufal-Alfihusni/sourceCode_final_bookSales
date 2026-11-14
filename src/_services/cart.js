const cartStorageKey = "bookCart";

export const getCart = () => {
  const cart = localStorage.getItem(cartStorageKey);
  return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const addToCart = (book, quantity) => {
  const cart = getCart();
  const existingBook = cart.find(
    (item) => String(item.id) === String(book.id),
  );
  const newQuantity = (existingBook?.quantity || 0) + quantity;
  const stock = Number(book.stock);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    !Number.isFinite(stock) ||
    newQuantity > stock
  ) {
    return false;
  }

  if (existingBook) {
    existingBook.quantity = newQuantity;
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price,
      cover_photo: book.cover_photo,
      stock,
      quantity,
    });
  }

  saveCart(cart);
  return true;
};

export const updateCartQuantity = (bookId, quantity) => {
  const cart = getCart();
  const book = cart.find((item) => String(item.id) === String(bookId));

  if (
    !book ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > book.stock
  ) {
    return false;
  }

  book.quantity = quantity;
  saveCart(cart);
  return true;
};

export const removeFromCart = (bookId) => {
  const cart = getCart().filter((item) => String(item.id) !== String(bookId));
  saveCart(cart);
};

export const clearCart = () => {
  saveCart([]);
};
