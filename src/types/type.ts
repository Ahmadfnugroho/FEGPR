export interface Category {
  id: number;
  name: string;
  photo: string;
  slug: string;
  products_count: number;
  products: Product[];
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  slug: string;
}

export interface SubCategory {
  id: number;
  name: string;
  photo: string;
  slug: string;
}
export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  thumbnail: string;
  status: "available" | "unavailable";
  description: string;
  slug: string;
  premiere: number | boolean;
  productPhotos: ProductPhoto[];
  productSpecifications: productSpecification[];
  category: Category;
  brand: Brand;
  rentalIncludes: RentalInclude[]; // Ganti dari includes menjadi rentalIncludes
  subCategory: SubCategory;
}

export interface ProductPhoto {
  id: number;
  photo: string;
}

export interface productSpecification {
  id: number;
  product_id: number;
  name: string;
}
export interface RentalInclude {
  id: number;
  quantity: string;
  included_product: {
    id: number;
    name: string;
    slug: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: UserPhone[];
}

interface UserPhone {
  id: number;
  phone_number: number[];
}
export interface Bundling {
  id: number;
  name: string;
  price: number;
  slug: string;
  premiere: boolean;
  products: BundlingProduct[];
}

export interface BundlingProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  status: "available" | "unavailable";
  price: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    slug: string;
  };
  subCategory?: {
    id: number;
    name: string;
    slug: string;
  };
  productPhotos: ProductPhoto[];
  productSpecifications: productSpecification[];
  rentalIncludes: RentalInclude[];
}

export interface BookingDetails {
  id: number;
  user: User;
  booking_transaction_id: string;
  grand_total: number;
  status: "pending" | "paid" | "cancelled";
  start_date: string;
  end_date: string;
  duration: number;
  product: Product;
  quantity: number;
  include: RentalInclude;
}
