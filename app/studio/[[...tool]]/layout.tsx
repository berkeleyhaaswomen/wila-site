// Studio owns its own <html>/<body> — bypass the site chrome.
export const metadata = {
  title: "WILA Content Studio"
};

export default function StudioLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
