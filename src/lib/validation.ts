import { z } from "zod";
import { BANKS } from "@/lib/offers/data";

export const cardSchema = z.object({
  id: z.string().optional(),
  bank: z.enum(BANKS),
  type: z.enum(["credit", "debit"]),
  network: z.enum(["visa", "mastercard", "rupay", "amex"]),
  productId: z.string().nullish(),
  label: z.string().max(40).nullish(),
});

export const compareSchema = z.object({
  productId: z.string(),
  cards: z.array(cardSchema).max(20).default([]),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const alertSchema = z.object({
  productId: z.string(),
  targetPrice: z.number().int().positive(),
});
