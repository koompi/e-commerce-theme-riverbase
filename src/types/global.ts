import { ItemProduct } from "./product";
import { UserType } from "./user";

export type ContextAuth = {
  user: () => UserType;
  getUser: () => void;
  loading: () => void;
  login: (model: string | null) => void;
};

export type CartItem = {
  product: ItemProduct;
  quantity: number;
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: ItemProduct, variant: boolean) => void;
  minusCart: (product: ItemProduct, variant: boolean) => void;
  removeFromCart: (productId: string, variant: boolean) => void;
  addCarts: (cartItems: CartItem[]) => void;
  cleanCartItems: Function;
  logout: Function;
};

export type LoginForm = {
  email?: string;
  phone?: string;
  password?: string;
};

export type Social = {
  name: string;
  enable: boolean;
  link: string;
};

export type FooterContact = {
  address: string;
  phone: string;
  email: string;
};

export type FooterConfig = {
  socials: Social[];
  contact: FooterContact;
};

export type Member = {
  name: string;
  position: string;
  photo: string;
};

export type AboutConfig = {
  title: string;
  description: string;
  members: Member[];
};
