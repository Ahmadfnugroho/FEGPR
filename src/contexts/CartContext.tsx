// src/contexts/CartContext.tsx
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: string; // unique identifier for cart item
  type: "product" | "bundling";
  productId?: number;
  bundlingId?: number;
  name: string;
  slug: string;
  price: number;
  thumbnail?: string;
  quantity: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  duration: number; // in days
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_ITEM"; payload: { id: string; updates: Partial<CartItem> } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "LOAD_FROM_STORAGE"; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.type === newItem.type &&
          (newItem.type === "product"
            ? item.productId === newItem.productId
            : item.bundlingId === newItem.bundlingId) &&
          item.startDate === newItem.startDate &&
          item.endDate === newItem.endDate
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
      }

      const newState = {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity * item.duration,
          0
        ),
      };

      return newState;
    }

    case "UPDATE_ITEM": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity * item.duration,
          0
        ),
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity * item.duration,
          0
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      };

    case "LOAD_FROM_STORAGE": {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: items.reduce(
          (total, item) => total + item.price * item.quantity * item.duration,
          0
        ),
      };
    }

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "id">) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  generateWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "gpr_cart";

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    try {
      const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: "LOAD_FROM_STORAGE", payload: cartData });
      }
    } catch (error) {
      console.error("Error loading cart from storage:", error);
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const cartItem: CartItem = {
      ...item,
      id: `${item.type}-${
        item.type === "product" ? item.productId : item.bundlingId
      }-${item.startDate}-${item.endDate}-${Date.now()}`,
    };
    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, updates } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const openCart = () => {
    dispatch({ type: "SET_CART_OPEN", payload: true });
  };

  const closeCart = () => {
    dispatch({ type: "SET_CART_OPEN", payload: false });
  };

  const generateWhatsAppMessage = (): string => {
    if (state.items.length === 0) {
      return "Halo, saya ingin menanyakan tentang rental peralatan foto.";
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    let message = "Halo, saya mau sewa alat:\n\n";
    message += "Nama:\n\n";
    message += "Akan Sewa Unit:\n";

    state.items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Jumlah: ${item.quantity} unit\n`;
      message += `   Durasi: ${item.duration} hari\n`;
      message += `   Tanggal Ambil: ${formatDate(item.startDate)}\n`;
      message += `   Tanggal Kembali: ${formatDate(item.endDate)}\n`;
    });

    message += "Jam Pengambilan: \n\n";
    message += "Mohon konfirmasi ketersediaan alat.\n";
    message += "Terima kasih";

    return message;
  };

  const contextValue: CartContextType = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    generateWhatsAppMessage,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
