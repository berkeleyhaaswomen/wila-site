import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getEvent, listEventPhotos } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";
import EventPhotos from "@/components/admin/EventPhotos";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params
}: {
  params: { id: string };
}) {
  const user = await requireUser(`/admin/events/${params.id}`);
  const event = await getEvent(params.id);
  if (!event) notFound();
  const photos = await listEventPhotos(params.id);

  return (
    <AdminShell user={user} current="/admin/events" title="Edit event">
      <div className="space-y-8">
        <EventPhotos eventId={params.id} photos={photos} />
        <EventForm event={event} />
      </div>
    </AdminShell>
  );
}
