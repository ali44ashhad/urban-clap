import React, { createContext, useReducer, useContext, useEffect } from "react";

const STORAGE_KEY = "ac_cart_js";

const initialState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.payload;
      const found = state.items.find(
        (i) => i.id === item.id && i.variant === item.variant
      );
      if (found) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.variant === item.variant
              ? { ...i, qty: i.qty + item.qty }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }
    case "UPDATE": {
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id && i.variant === action.payload.variant
            ? { ...i, qty: action.payload.qty }
            : i
        ),
      };
    }
    case "REMOVE": {
      return {
        items: state.items.filter(
          (i) => !(i.id === action.payload.id && i.variant === action.payload.variant)
        ),
      };
    }
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
