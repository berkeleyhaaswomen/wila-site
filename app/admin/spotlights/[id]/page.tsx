import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { getSpotlightById } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import SpotlightForm from "@/components/admin/SpotlightForm";

export const dynamic = "force-dynamic";

export default async function EditSpotlightPage({
  params
}: {
  params: { id: string };
}) {
  const user = await requireUser(`/admin/spotlights/${params.id}`);
  const spotlight = await getSpotlightById(params.id);
  if (!spotlight) notFound();

  return (
    <AdminShell user={user} current="/admin/spotlights" title="Edit spotlight">
      <SpotlightForm
        spotlight={spotlight}
        uploadsEnabled={dbConfigured() || Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </AdminShell>
  );
}
