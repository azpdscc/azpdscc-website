
export type EventCategory = 'Music' | 'Food' | 'Dance' | 'Cultural';

export type Event = {
  id: string; // Firestore document ID is a string
  slug: string;
  name: string;
  date: string; // Keep as string for simplicity, e.g. "April 02, 2025"
  time: string;
  locationName: string;
  locationAddress: string;
  image: string;
  description: string;
  fullDescription: string;
  category: EventCategory;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
};

export type VendorApplication = {
  name: string;
  organization?: string;
  email: string;
  phone: string;
  boothType: '10x10-own' | '10x10-our' | '10x20-own' | '10x20-our';
  productDescription: string;
  zelleSenderName: string;
  zelleDateSent: Date;
  paymentSent: boolean;
};

export type DonationFormValues = {
  frequency: 'one-time' | 'monthly';
  amount: string;
  customAmount?: string;
  name: string;
  email: string;
  paymentMethod: 'zelle' | 'credit-card';
  zelleSenderName?: string;
  zelleTransactionId?: string;
  paymentSent?: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
};
