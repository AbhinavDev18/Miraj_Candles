export interface Product {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  category: string;
  stock: number;
  sales?: number;
  features?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface StoreSettings {
  name: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}