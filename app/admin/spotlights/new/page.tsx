import { requireUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import SpotlightForm from "@/components/admin/SpotlightForm";

export const dynamic = "force-dynamic";

export default async function NewSpotlightPage() {
  const user = await requireUser("/admin/spotlights/new");
  return (
    <AdminShell user={user} current="/admin/spotlights" title="New spotlight">
      <SpotlightForm uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
    </AdminShell>
  );
}
