import { requireUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await requireUser("/admin/events/new");
  return (
    <AdminShell user={user} current="/admin/events" title="New event">
      <EventForm />
    </AdminShell>
  );
}
