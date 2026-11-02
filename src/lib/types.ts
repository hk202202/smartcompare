export type Category = "electronics" | "grocery";

export type PlatformId =
  | "amazon"
  | "flipkart"
  | "croma"
  | "reliance"
  | "blinkit"
  | "zepto"
  | "instamart"
  | "bigbasket";

export interface Platform {
  id: PlatformId;
  name: string;
  categories: Category[];
  trustScore: number;
  returnDays: number;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  keywords: string[];
  mrp: number;
}

export interface Listing {
  productId: string;
  platform: PlatformId;
  title: string;
  price: number;
  mrp: number;
  inStock: boolean;
  deliveryMinutes: number;
  deliveryLabel: string;
  url: string;
  fetchedAt: string;
}

export type CardType = "credit" | "debit";
export type CardNetwork = "visa" | "mastercard" | "rupay" | "amex";

export interface UserCard {
  id: string;
  bank: string;
  type: CardType;
  network: CardNetwork;
  productId?: string | null;
  label?: string | null;
}

export interface BankOffer {
  id: string;
  bank: string;
  cardProductId?: string;
  cardTypes: CardType[];
  platforms: PlatformId[];
  categories?: Category[];
  kind: "instant" | "cashback";
  percent?: number;
  flat?: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export interface AppliedOffer {
  card: UserCard | null;
  offer: BankOffer | null;
  discount: number;
  effectivePrice: number;
}

export interface PricedListing extends Listing {
  bestOffer: AppliedOffer;
  allOffers: AppliedOffer[];
}

export interface RankedListing extends PricedListing {
  score: number;
  rank: number;
  reasons: string[];
}

export interface CompareResult {
  product: Product;
  listings: RankedListing[];
  winner: RankedListing | null;
  savingsVsWorst: number;
  summary: string;
}
