export interface Kost {
  id: number;
  name: string;
  type: string;
  location: string;
  price: number;
  imageUrl: string;
  isNew?: boolean;
}

export interface Business {
  id: number;
  name: string;
  priceRange: string;
  image: string;
  isNew?: boolean;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  imageUrl: string;
}