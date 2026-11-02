import type { PlatformAdapter } from "@/lib/platforms/adapter";
import { createMockAdapter } from "@/lib/platforms/mock";
import type { PlatformId } from "@/lib/types";

const ALL: PlatformId[] = ["amazon", "flipkart", "croma", "reliance", "blinkit", "zepto", "instamart", "bigbasket"];

/**
 * SMARTCOMPARE_PLATFORMS is a comma-separated allowlist; unset means all platforms.
 * Swap a mock for a live adapter (affiliate API, Apify actor, etc.) here without touching callers.
 */
export function getAdapters(): PlatformAdapter[] {
  const allow = process.env.SMARTCOMPARE_PLATFORMS?.split(",").map((s) => s.trim()).filter(Boolean);
  return ALL.filter((p) => !allow?.length || allow.includes(p)).map(createMockAdapter);
}
