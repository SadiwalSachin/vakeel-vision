"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps the application with next-themes ThemeProvider.
 * Supports "light", "dark", and "system" themes.
 * Applies the active theme class to the <html> element.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
