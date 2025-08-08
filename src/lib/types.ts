

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
export type BlogPostFormData = Partial<Omit<BlogPost, 'id' | 'date'>> & {
    date?: Date;
};

export type ScheduledBlogPost = {
    id: string;
    title: string;
    image: string;
    publishDate: string; // Stored as "Month Day, YYYY"
    status: 'Pending' | 'Processed' | 'Error';
    processedAt?: string;
    generatedPostId?: string;
    errorMessage?: string;
};

export type ScheduledBlogPostFormData = Omit<ScheduledBlogPost, 'id' | 'publishDate' | 'status' | 'generatedPostId'> & {
    publishDate: Date;
};


export type GenerateBlogPostOutput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
};
