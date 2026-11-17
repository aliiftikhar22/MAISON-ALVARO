export type Category = 'for-him' | 'for-her' | 'unisex';
export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductSize {
  label: string;
  /** Price in PKR (whole rupees) */
  price: number;
  compareAtPrice?: number;
}

export interface FragranceNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  date?: string;
  /** True for placeholder reviews that must be replaced with real feedback */
  isDemo?: boolean;
}

export interface Product {
  /** Equal to the slug; used as the Firestore document id */
  id: string;
  slug: string;
  name: string;
  category: Category;
  isGiftSet: boolean;
  shortDescription: string;
  /** Paragraphs */
  description: string[];
  sizes: ProductSize[];
  availability: Availability;
  /** Unpublished products show an "unavailable" page and are hidden from listings */
  published: boolean;
  bestSeller: boolean;
  signature: boolean;
  images: ProductImage[];
  notes: FragranceNotes;
  ingredients?: string;
  specifications: ProductSpec[];
  reviews: Review[];
  /** True for placeholder catalogue entries */
  isDemo: boolean;
  createdAt: number;
}

export interface Collection {
  slug: string;
  title: string;
  tagline: string;
  category?: Category;
  giftSets?: boolean;
}

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  size: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  createdAt: number;
  status: OrderStatus;
  paymentMethod: 'cod';
  customer: { name: string; phone: string; email?: string };
  address: { line1: string; city: string; province: string; postalCode?: string; notes?: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  isDemo: boolean;
}
