"use client";

import { useEffect } from "react";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const themeKeys = [
  ["announcement_bg_color", "--announcement-bg"],
  ["announcement_text_color", "--announcement-text"],
  ["header_bg_color", "--header-bg"],
  ["page_bg_color", "--page-bg"],
  ["product_card_bg_color", "--product-card-bg"],
  ["footer_bg_color", "--footer-bg"],
  ["footer_text_color", "--footer-text"],
  ["button_bg_color", "--button-bg"],
  ["button_text_color", "--button-text"],
  ["text_color", "--ink"],
  ["muted_text_color", "--muted"],
] as const;

export default function ThemeVars() {
  useEffect(() => {
    let cancelled = false;

    const applyTheme = async () => {
      try {
        const response = await fetch(`/api/settings?t=${Date.now()}`, { cache: "no-store" });
        const data = response.ok ? await response.json() : {};
        const settings = { ...DEFAULT_SETTINGS, ...data } as any;

        if (cancelled) return;

        for (const [key, cssVar] of themeKeys) {
          const value = settings[key];
          if (typeof value === "string" && value.trim()) {
            document.documentElement.style.setProperty(cssVar, value.trim());
          }
        }
      } catch {
        // keep defaults
      }
    };

    applyTheme();

    const onFocus = () => applyTheme();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "balisa-settings-updated") applyTheme();
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
