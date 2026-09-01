import { requireSuperadmin } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listMembers, type MemberRow } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import { FormNotice } from "@/components/admin/Field";
import MembersTable from "./MembersTable";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams
}: {
  searchParams: { removed?: string };
}) {
  const me = await requireSuperadmin("/admin/members");

  let members: MemberRow[] = [];
  let loadError: string | null = null;

  if (dbConfigured()) {
    try {
      members = await listMembers();
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    }
  } else {
    loadError = "DATABASE_URL isn't set.";
  }

  return (
    <AdminShell user={me} current="/admin/members" title="Members">
      <div className="space-y-4">
        {searchParams.removed && <FormNotice message="Member removed." />}
        {loadError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {loadError}
          </div>
        )}
      </div>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
        Everyone who has signed up through the public form. Check their LinkedIn
        profile to confirm they are a Haas alumna before adding them to a
        mailing list. This page is limited to super admins because it is the
        only place holding personal details collected from outside the board.
      </p>

      <MembersTable members={members} />
    </AdminShell>
  );
}
