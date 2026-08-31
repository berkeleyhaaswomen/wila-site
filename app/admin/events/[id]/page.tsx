import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getEvent } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params
}: {
  params: { id: string };
}) {
  const user = await requireUser(`/admin/events/${params.id}`);
  const event = await getEvent(params.id);
  if (!event) notFound();

  return (
    <AdminShell user={user} current="/admin/events" title="Edit event">
      <EventForm event={event} />
    </AdminShell>
  );
}
