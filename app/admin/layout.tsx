import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WILA Admin",
  description: "Manage WILA events, spotlights, and access.",
  robots: { index: false, follow: false }
};

/**
 * The admin site has its own chrome — none of the public site's nav or footer.
 * Individual pages render <AdminShell> for the signed-in layout; the login
 * page deliberately doesn't, so it stays a bare, centred card.
 */
export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-soft-gray">{children}</div>;
}
