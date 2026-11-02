import type { BankOffer, CardType } from "@/lib/types";

export const BANKS = ["HDFC", "ICICI", "SBI", "Axis", "Kotak", "IDFC First", "Yes Bank", "AU", "OneCard", "Other"] as const;

export interface CardProduct {
  id: string;
  bank: (typeof BANKS)[number];
  name: string;
  type: CardType;
}

/** Co-branded / well-known cards that unlock offers beyond the generic bank offer. */
export const CARD_PRODUCTS: CardProduct[] = [
  { id: "icici-amazon-pay", bank: "ICICI", name: "Amazon Pay ICICI", type: "credit" },
  { id: "axis-flipkart", bank: "Axis", name: "Flipkart Axis Bank", type: "credit" },
  { id: "hdfc-swiggy", bank: "HDFC", name: "Swiggy HDFC", type: "credit" },
  { id: "hdfc-millennia", bank: "HDFC", name: "HDFC Millennia", type: "credit" },
  { id: "sbi-cashback", bank: "SBI", name: "SBI Cashback", type: "credit" },
  { id: "axis-ace", bank: "Axis", name: "Axis Ace", type: "credit" },
];

const ELEC = ["electronics"] as const;
const GROC = ["grocery"] as const;

export const BANK_OFFERS: BankOffer[] = [
  { id: "amz-hdfc-cc", bank: "HDFC", cardTypes: ["credit"], platforms: ["amazon"], categories: [...ELEC], kind: "instant", percent: 10, maxDiscount: 5000, minOrder: 5000, description: "10% instant discount up to ₹5,000 on HDFC credit cards" },
  { id: "amz-icici-pay", bank: "ICICI", cardProductId: "icici-amazon-pay", cardTypes: ["credit"], platforms: ["amazon"], kind: "cashback", percent: 5, maxDiscount: 100000, minOrder: 0, description: "5% unlimited cashback for Prime members with Amazon Pay ICICI" },
  { id: "amz-sbi-dc", bank: "SBI", cardTypes: ["debit"], platforms: ["amazon"], categories: [...ELEC], kind: "instant", percent: 7.5, maxDiscount: 1500, minOrder: 10000, description: "7.5% instant discount up to ₹1,500 on SBI debit cards" },

  { id: "fk-axis-cobrand", bank: "Axis", cardProductId: "axis-flipkart", cardTypes: ["credit"], platforms: ["flipkart"], kind: "cashback", percent: 5, maxDiscount: 4000, minOrder: 0, description: "5% cashback with Flipkart Axis Bank card" },
  { id: "fk-icici-cc", bank: "ICICI", cardTypes: ["credit"], platforms: ["flipkart"], categories: [...ELEC], kind: "instant", flat: 4000, maxDiscount: 4000, minOrder: 50000, description: "Flat ₹4,000 off on ICICI credit cards (orders above ₹50,000)" },
  { id: "fk-sbi-cc", bank: "SBI", cardTypes: ["credit"], platforms: ["flipkart"], categories: [...ELEC], kind: "instant", percent: 10, maxDiscount: 2500, minOrder: 7500, description: "10% instant discount up to ₹2,500 on SBI credit cards" },

  { id: "croma-hdfc", bank: "HDFC", cardTypes: ["credit", "debit"], platforms: ["croma"], kind: "instant", percent: 7.5, maxDiscount: 6000, minOrder: 15000, description: "7.5% instant discount up to ₹6,000 on HDFC cards" },
  { id: "croma-kotak", bank: "Kotak", cardTypes: ["credit"], platforms: ["croma"], kind: "instant", flat: 3000, maxDiscount: 3000, minOrder: 30000, description: "Flat ₹3,000 off on Kotak credit cards" },

  { id: "rd-icici", bank: "ICICI", cardTypes: ["credit"], platforms: ["reliance"], kind: "instant", percent: 10, maxDiscount: 7500, minOrder: 20000, description: "10% instant discount up to ₹7,500 on ICICI credit cards" },
  { id: "rd-idfc", bank: "IDFC First", cardTypes: ["credit"], platforms: ["reliance"], kind: "instant", percent: 5, maxDiscount: 3000, minOrder: 10000, description: "5% off up to ₹3,000 on IDFC First credit cards" },

  { id: "im-hdfc-swiggy", bank: "HDFC", cardProductId: "hdfc-swiggy", cardTypes: ["credit"], platforms: ["instamart"], kind: "cashback", percent: 10, maxDiscount: 1500, minOrder: 0, description: "10% cashback on Instamart with Swiggy HDFC card" },
  { id: "bk-axis", bank: "Axis", cardTypes: ["credit", "debit"], platforms: ["blinkit"], categories: [...GROC], kind: "instant", percent: 10, maxDiscount: 100, minOrder: 499, description: "10% off up to ₹100 on Axis cards (orders above ₹499)" },
  { id: "zp-onecard", bank: "OneCard", cardTypes: ["credit"], platforms: ["zepto"], kind: "instant", flat: 75, maxDiscount: 75, minOrder: 399, description: "Flat ₹75 off with OneCard on orders above ₹399" },
  { id: "bb-icici", bank: "ICICI", cardTypes: ["credit"], platforms: ["bigbasket"], kind: "instant", percent: 10, maxDiscount: 200, minOrder: 1000, description: "10% off up to ₹200 on ICICI credit cards" },

  { id: "any-sbi-cashback", bank: "SBI", cardProductId: "sbi-cashback", cardTypes: ["credit"], platforms: ["amazon", "flipkart", "croma", "reliance", "blinkit", "zepto", "instamart", "bigbasket"], kind: "cashback", percent: 5, maxDiscount: 5000, minOrder: 0, description: "5% online cashback with SBI Cashback card" },
  { id: "any-axis-ace", bank: "Axis", cardProductId: "axis-ace", cardTypes: ["credit"], platforms: ["amazon", "flipkart", "croma", "reliance", "blinkit", "zepto", "instamart", "bigbasket"], kind: "cashback", percent: 1.5, maxDiscount: 100000, minOrder: 0, description: "1.5% flat cashback with Axis Ace" },
  { id: "any-hdfc-millennia", bank: "HDFC", cardProductId: "hdfc-millennia", cardTypes: ["credit"], platforms: ["amazon", "flipkart", "instamart", "zepto", "blinkit"], kind: "cashback", percent: 5, maxDiscount: 1000, minOrder: 0, description: "5% cashback on partner merchants with HDFC Millennia" },
];
