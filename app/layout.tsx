import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "SnipVault",
  description:
    "A UI snippet vault for developers. Store reusable components, preview them live with Sandpack, and manage your personal design system.",
  icons: {
    icon: [{ url: "/SnipVault.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
