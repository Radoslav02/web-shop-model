// Redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  price: number;
}

interface CartState {
  items: CartItem[];
}

// Load cart items from local storage
const loadCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("cartItems");
  return savedCart ? JSON.parse(savedCart) : [];
};

const initialState: CartState = {
  items: loadCartFromLocalStorage(), // Load saved cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
      saveCartToLocalStorage(state.items); // Save cart items to local storage
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.productId !== action.payload);
      saveCartToLocalStorage(state.items); // Save updated cart items
    },
    clearCart(state) {
      state.items = [];
      saveCartToLocalStorage(state.items); // Clear cart items from local storage
    },
  },
});

// Function to save cart items to local storage
const saveCartToLocalStorage = (items: CartItem[]) => {
  localStorage.setItem("cartItems", JSON.stringify(items));
};

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
