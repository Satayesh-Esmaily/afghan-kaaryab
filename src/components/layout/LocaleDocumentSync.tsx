"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { getLocaleDirection } from "@/i18n/utils";

export default function LocaleDocumentSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
  }, [locale]);

  return null;
}
