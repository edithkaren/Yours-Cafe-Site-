export type SpiceLevel = 0 | 1 | 2 | 3;

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
  isBestseller: boolean;
  isAvailable: boolean;
  addOns: { name: string; price: number }[];
  imageUrl?: string | null;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  isActive: boolean;
};

export type Special = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  isActive: boolean;
};

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  seating: string;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};
