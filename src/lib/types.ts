export type EventCategory = 'Music' | 'Food' | 'Dance' | 'Cultural';

export type Event = {
  id: number;
  slug: string;
  name: string;
  date: string;
  time: string;
  location: string;
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
  boothType: '10x10' | '10x20' | 'Food Stall' | 'Merchandise';
  productDescription: string;
  zelleSenderName: string;
  zelleTransactionId?: string;
  zelleDateSent: Date;
  paymentSent: boolean;
};
