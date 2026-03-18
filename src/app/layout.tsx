import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Philippines: Middle East Conflict Economic Impact",
  description:
    "Dashboard tracking the economic impact of the U.S.–Iran / Middle East conflict on the Philippines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
