/**
 * WILA Content Studio — embedded Sanity Studio.
 *
 * Available at: /studio
 * Auth: users log in with email or Google via Sanity.
 * Permissions: managed at https://sanity.io/manage → Members.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";
import { sanityConfigured } from "../../../sanity/env";

export const dynamic = "force-static";
export const metadata = {
  title: "WILA Content Studio",
  robots: { index: false, follow: false }
};

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          background: "#FBF7F0",
          color: "#0A1F33"
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              background: "#003262",
              color: "#FDB515",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase"
            }}
          >
            Setup required
          </div>
          <h1 style={{ marginTop: 16, fontSize: 28, fontWeight: 700 }}>
            Connect the Content Studio
          </h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#0A1F33bb" }}>
            The Sanity project ID isn't set yet. Follow the steps in{" "}
            <code>ADMIN.md</code> to create a Sanity project, then add the
            environment variables to Vercel and redeploy.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
