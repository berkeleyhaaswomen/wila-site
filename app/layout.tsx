import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WILA · Women in Leadership Alumnae | Berkeley Haas",
  description:
    "A global network of Berkeley Haas alumnae dedicated to fostering a supportive community that uplifts and empowers women.",
  openGraph: {
    title: "WILA · Women in Leadership Alumnae",
    description:
      "A global network of Berkeley Haas alumnae fostering community, mentorship, and leadership.",
    url: "https://wila.haasalumni.org",
    siteName: "WILA Berkeley Haas",
    type: "website"
  },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
