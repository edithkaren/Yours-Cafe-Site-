import type { Category, MenuItem, Offer, EventItem, Special } from "@/lib/types";

// Sample content only — edit or replace via the admin dashboard.
// No food imagery: imageUrl stays null so placeholders render.

export const categories: Category[] = [
  { id: "c-indian", slug: "indian", name: "Indian", description: "Curries, biryani and tandoor-fresh breads.", sortOrder: 1 },
  { id: "c-italian", slug: "italian", name: "Italian", description: "Pasta, pizza and cheesy comfort.", sortOrder: 2 },
  { id: "c-mexican", slug: "mexican", name: "Mexican", description: "Tacos, quesadillas and bright, zesty bites.", sortOrder: 3 },
  { id: "c-chinese", slug: "chinese", name: "Chinese", description: "Noodles, fried rice and wok-tossed favourites.", sortOrder: 4 },
  { id: "c-momos", slug: "momos", name: "Momos", description: "Steamed, fried, tandoori and in gravy.", sortOrder: 5 },
  { id: "c-frankie", slug: "frankie-rolls", name: "Frankie & Rolls", description: "Hand-rolled wraps with a kick.", sortOrder: 6 },
  { id: "c-street", slug: "street-food", name: "Street Food", description: "Quick plates from the everyday street.", sortOrder: 7 },
  { id: "c-snacks", slug: "snacks-starters", name: "Snacks & Starters", description: "Crispy bites to start the table.", sortOrder: 8 },
  { id: "c-bev", slug: "beverages", name: "Beverages", description: "Shakes, mocktails, coffee and tea.", sortOrder: 9 },
  { id: "c-desserts", slug: "desserts", name: "Desserts", description: "Something sweet to finish.", sortOrder: 10 },
  { id: "c-combos", slug: "combos-specials", name: "Combos & Specials", description: "Meals for one, two or the whole group.", sortOrder: 11 },
];

const m = (
  id: string,
  categoryId: string,
  name: string,
  description: string,
  price: number,
  o: Partial<Pick<MenuItem, "isVeg" | "spiceLevel" | "isBestseller" | "addOns">> = {}
): MenuItem => ({
  id,
  categoryId,
  name,
  description,
  price,
  isVeg: o.isVeg ?? true,
  spiceLevel: o.spiceLevel ?? 0,
  isBestseller: o.isBestseller ?? false,
  isAvailable: true,
  addOns: o.addOns ?? [],
  imageUrl: null,
});

export const menuItems: MenuItem[] = [
  // Indian
  m("i1", "c-indian", "Paneer Butter Masala", "Soft paneer in a silky tomato-cashew gravy.", 260, { spiceLevel: 1, isBestseller: true, addOns: [{ name: "Extra butter naan", price: 60 }] }),
  m("i2", "c-indian", "Dal Tadka", "Yellow lentils tempered with cumin, garlic and ghee.", 180, { spiceLevel: 1 }),
  m("i3", "c-indian", "Chicken Handi", "Slow-cooked in a kadhai with whole spices.", 340, { isVeg: false, spiceLevel: 2 }),
  m("i4", "c-indian", "Veg Dum Biryani", "Fragrant basmati layered with seasonal vegetables.", 280, { spiceLevel: 2, isBestseller: true, addOns: [{ name: "Raita", price: 40 }] }),
  m("i5", "c-indian", "Butter Naan", "Tandoor-baked, brushed with butter.", 60),
  m("i6", "c-indian", "Lachha Paratha", "Flaky layered whole-wheat bread.", 70),

  // Italian
  m("it1", "c-italian", "Creamy Alfredo Penne", "Penne in a parmesan and garlic cream sauce.", 300, { isBestseller: true }),
  m("it2", "c-italian", "Margherita Pizza", "Tomato, fresh mozzarella and basil on a thin base.", 320),
  m("it3", "c-italian", "Cheesy Garlic Bread", "Toasted baguette with garlic butter and mozzarella.", 170, { addOns: [{ name: "Add jalapeños", price: 25 }] }),
  m("it4", "c-italian", "Arrabbiata Penne", "Penne in a fiery tomato and chilli sauce.", 280, { spiceLevel: 2 }),

  // Mexican
  m("mx1", "c-mexican", "Veg Tacos (3 pcs)", "Soft tortillas with spiced beans, salsa and slaw.", 240, { spiceLevel: 2, isBestseller: true }),
  m("mx2", "c-mexican", "Cheese Quesadilla", "Grilled tortilla packed with melted cheese and peppers.", 230, { addOns: [{ name: "Guacamole", price: 50 }] }),
  m("mx3", "c-mexican", "Loaded Nachos", "Crisp nachos, cheese sauce, jalapeños and salsa.", 260, { spiceLevel: 2 }),

  // Chinese
  m("cn1", "c-chinese", "Veg Hakka Noodles", "Wok-tossed noodles with crunchy vegetables.", 210, { spiceLevel: 1 }),
  m("cn2", "c-chinese", "Schezwan Fried Rice", "Rice tossed in a bold schezwan sauce.", 230, { spiceLevel: 3, isBestseller: true }),
  m("cn3", "c-chinese", "Veg Manchurian", "Crispy vegetable dumplings in a tangy gravy.", 240, { spiceLevel: 2 }),
  m("cn4", "c-chinese", "Veg Spring Rolls (4 pcs)", "Golden rolls with a light vegetable filling.", 160),

  // Momos
  m("mo1", "c-momos", "Steamed Veg Momos (6 pcs)", "Classic steamed dumplings with a house chutney.", 140, { isBestseller: true }),
  m("mo2", "c-momos", "Fried Momos (6 pcs)", "Crispy-fried momos, golden and crunchy.", 160),
  m("mo3", "c-momos", "Tandoori Momos (6 pcs)", "Smoky tandoori-marinated momos.", 180, { spiceLevel: 2 }),
  m("mo4", "c-momos", "Gravy Momos (6 pcs)", "Momos simmered in a spicy, tangy gravy.", 190, { spiceLevel: 3 }),
  m("mo5", "c-momos", "Chicken Steamed Momos (6 pcs)", "Juicy chicken filling, steamed to order.", 170, { isVeg: false }),

  // Frankie & Rolls
  m("fr1", "c-frankie", "Paneer Frankie", "Spiced paneer, onions and mint chutney in a flaky roll.", 150, { spiceLevel: 1, isBestseller: true, addOns: [{ name: "Extra cheese", price: 30 }] }),
  m("fr2", "c-frankie", "Veg Roll", "Seasonal vegetables in a soft roti wrap.", 120),
  m("fr3", "c-frankie", "Cheese Roll", "Melted cheese and vegetables, rolled and grilled.", 160),
  m("fr4", "c-frankie", "Spicy Schezwan Wrap", "Schezwan veggies in a tangy, fiery wrap.", 170, { spiceLevel: 3 }),

  // Street Food
  m("sf1", "c-street", "Pav Bhaji", "Buttery mashed vegetables with toasted pav.", 180, { isBestseller: true }),
  m("sf2", "c-street", "Vada Pav", "Spiced potato fritter in a soft bun.", 60, { spiceLevel: 2 }),
  m("sf3", "c-street", "Pani Puri (6 pcs)", "Crisp shells, tangy water, spiced potato.", 80, { spiceLevel: 2 }),

  // Snacks & Starters
  m("sn1", "c-snacks", "Masala Fries", "Crispy fries with house spice mix.", 130, { spiceLevel: 1 }),
  m("sn2", "c-snacks", "Veg Crispy Bites", "Golden fried vegetable bites with dip.", 180),
  m("sn3", "c-snacks", "Classic Veg Sandwich", "Grilled sandwich with veggies and cheese.", 140),
  m("sn4", "c-snacks", "Veg Burger", "Crispy patty, lettuce, tomato and sauce.", 160, { isBestseller: true }),
  m("sn5", "c-snacks", "Chicken Burger", "Grilled chicken patty with fresh toppings.", 190, { isVeg: false }),

  // Beverages
  m("bv1", "c-bev", "Cold Coffee", "Chilled coffee blended with ice cream.", 160, { isBestseller: true }),
  m("bv2", "c-bev", "Mango Shake", "Thick, fresh mango milkshake.", 150),
  m("bv3", "c-bev", "Virgin Mojito", "Mint, lime and soda over ice.", 130),
  m("bv4", "c-bev", "Masala Chai", "Classic spiced tea, served hot.", 50),
  m("bv5", "c-bev", "Iced Lemon Tea", "Brewed tea with lemon and ice.", 110),

  // Desserts
  m("ds1", "c-desserts", "Chocolate Brownie", "Warm brownie with a scoop of vanilla ice cream.", 180, { isBestseller: true }),
  m("ds2", "c-desserts", "Butterscotch Ice Cream", "Two scoops, rich and creamy.", 120),
  m("ds3", "c-desserts", "Eggless Chocolate Cake Slice", "Moist chocolate cake, freshly baked.", 150),

  // Combos
  m("cb1", "c-combos", "Solo Thali", "Dal, paneer curry, rice, two rotis and dessert.", 320, { isBestseller: true }),
  m("cb2", "c-combos", "Duo Snack Combo", "Two Frankies, fries and two cold drinks.", 380),
  m("cb3", "c-combos", "Group Feast Platter", "Mixed starters, momos, noodles and dessert for four.", 1200),
];

export const offers: Offer[] = [
  { id: "o1", title: "Weekday Lunch Combo", description: "Mon–Fri, 12–3 PM. Ask for the lunch combo at the counter.", startsAt: null, endsAt: null, isActive: true },
  { id: "o2", title: "Group Dining", description: "Booking for 6 or more? Let us know ahead and we'll arrange a set menu.", startsAt: null, endsAt: null, isActive: true },
];

export const specials: Special[] = [
  { id: "s1", title: "Chef's Special Momos", description: "Tandoori momos with a smoky chilli-garlic dip, today only.", price: 190, isActive: true },
  { id: "s2", title: "Cold Coffee Happy Hour", description: "Get a second cold coffee at half price, 4–6 PM.", price: null, isActive: true },
];

export const events: EventItem[] = [
  { id: "e1", title: "Live Music Thursday", description: "Acoustic evenings with local artists, every Thursday at 8 PM.", eventDate: "Every Thursday", isActive: true },
];
