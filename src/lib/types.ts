
import type { Timestamp } from "firebase/firestore";


export type EventCategory = 'Music' | 'Food' | 'Dance' | 'Cultural';

export type Event = {
  id: string; // Firestore document ID is a string
  slug: string;
  name: string;
  date: string; // Stored as "Month Day, YYYY"
  time: string;
  locationName: string;
  locationAddress: string;
  image: string;
  description: string;
  fullDescription: string;
  category: EventCategory;
};

// Form data includes a Date object before it's converted to a string
export type EventFormData = Omit<Event, 'id' | 'date' | 'slug'> & {
  date: Date;
};

export type TeamMember = {
  id: string; // Firestore document ID is a string
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
};

export type Sponsor = {
  id: string;
  name: string;
  logo: string;
  level: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Other';
  website?: string;
};

// This represents the data coming from the live application form
export type VendorApplicationFormData = {
  id?: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
  boothType: string;
  totalPrice: string;
  productDescription: string;
  zelleSenderName: string;
  zelleDateSent: string;
  paymentConfirmed?: boolean;
  smsConsent?: boolean;
  qrCodeUrl?: string;
  eventId: string;
  eventName: string;
  eventDate: string;
};

// This represents the data stored in Firestore for verification
export type VendorApplication = {
  id: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
  boothType: string;
  totalPrice: string;
  productDescription: string;
  zelleSenderName: string;
  zelleDateSent: string;
  eventId: string;
  eventName: string;
  eventDate: string; 
  createdAt: string; // Serialized as ISO string
  status: 'Pending Verification' | 'Verified';
  verifiedAt?: string; // Serialized as ISO string
  checkInStatus: 'pending' | 'checkedIn';
  checkedInAt?: string; // Serialized as ISO string
  smsConsent?: boolean;
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
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string; // Stored as "Month Day, YYYY"
  image: string;
  excerpt: string;
  content: string;
  status: 'Draft' | 'Published';
};

// Form data includes a Date object before it's converted to a string
export type BlogPostFormData = Omit<BlogPost, 'id' | 'date' | 'slug' | 'status'> & {
    date: Date;
    status: 'Draft' | 'Published';
};

export type ScheduledBlogPost = {
    id: string;
    title: string;
    image: string;
    publishDate: string; // Stored as a string for display
    publishTimestamp: number; // Stored as a millisecond timestamp
    status: 'Pending' | 'Processed' | 'Error';
    processedAt?: Timestamp;
    generatedPostId?: string;
    errorMessage?: string;
};

export type ScheduledBlogPostFormData = {
    title: string;
    image: string;
    publishDate: Date;
};

export type CreateScheduledBlogPostData = {
    title: string;
    image: string;
    publishDate: Timestamp;
    generatedPostId: string;
}


export type GenerateBlogPostOutput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
};

export type Subscriber = {
  id: string; // Firestore document ID (email)
  email: string;
  name?: string;
  phone?: string;
  smsConsent?: boolean;
  subscribedAt: Timestamp;
};

export type PerformanceApplication = {
    id: string;
    groupName: string;
    contactName: string;
    email: string;
    phone: string;
    event: string;
    performanceType: string;
    participants: number;
    auditionLink?: string;
    specialRequests?: string;
    status: 'Pending' | 'Approved' | 'Declined';
    submittedAt: string; // ISO String
    smsConsent?: boolean;
}
