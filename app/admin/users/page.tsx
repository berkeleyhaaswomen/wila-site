import { requireSuperadmin } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { listUsers, type UserRow } from "@/lib/repo";
import AdminShell from "@/components/admin/AdminShell";
import { FormNotice, Card } from "@/components/admin/Field";
import { changeRole, removeUser, makeOwner } from "./actions";
import AddUserForm from "./AddUserForm";
import ResetPasswordForm from "./ResetPasswordForm";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  "last-superadmin":
    "That's the last super admin. Promote someone else first, otherwise nobody could manage users.",
  "self-delete":
    "You can't remove your own access. Ask another super admin to do it.",
  "owner-protected":
    "That's the owner's account. Only the owner can change or remove it \u2014 they'd have to hand ownership over first.",
  "owner-must-be-superadmin":
    "The owner has to stay a super admin. Hand ownership to someone else first.",
  "owner-only": "Only the current owner can hand ownership to someone else."
};

export default async function UsersPage({
  searchParams
}: {
  searchParams: {
    added?: string;
    updated?: string;
    removed?: string;
    owner?: string;
    error?: string;
  };
}) {
  const me = await requireSuperadmin("/admin/users");

  let users: UserRow[] = [];
  let loadError: string | null = null;

  if (dbConfigured()) {
    try {
      users = await listUsers();
    } catch (err) {
      loadError = err instanceof Error ? err.message : String(err);
    }
  } else {
    loadError = "DATABASE_URL isn't set.";
  }

  return (
    <AdminShell user={me} current="/admin/users" title="Website managers">
      <div className="space-y-4">
        {searchParams.added && <FormNotice message="Access granted." />}
        {searchParams.updated && <FormNotice message="Role updated." />}
        {searchParams.removed && <FormNotice message="Access removed." />}
        {searchParams.owner && <FormNotice message="Ownership transferred." />}
        {(searchParams.error || loadError) && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {ERRORS[searchParams.error ?? ""] ?? loadError}
          </div>
        )}
      </div>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
        <strong className="font-semibold text-ink">Super admins</strong> can do
        everything, including adding and removing the people on this page.{" "}
        <strong className="font-semibold text-ink">Admins</strong> can edit every
        page — events and spotlights — but can&apos;t change who has access.
        The <strong className="font-semibold text-ink">owner</strong> is one
        super admin that no other super admin can demote, remove, or reset the
        password of — so nobody can lock them out. Ownership can only be handed
        over by the owner.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/5 bg-white p-2 shadow-card">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-ink/50">
              <th className="px-4 py-2 font-semibold">Person</th>
              <th className="px-4 py-2 font-semibold">Role</th>
              <th className="px-4 py-2 font-semibold">Password</th>
              <th className="px-4 py-2 text-right font-semibold">Access</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-black/5 align-top">
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink">
                    {u.name || u.email}
                    {u.id === me.id && (
                      <span className="ml-2 text-xs font-normal text-ink/50">
                        (you)
                      </span>
                    )}
                    {u.isOwner && (
                      <span className="ml-2 rounded-full bg-california-gold/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-medalist">
                        Owner
                      </span>
                    )}
                  </div>
                  {u.name && (
                    <div className="text-xs text-ink/55">{u.email}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.isOwner && u.id !== me.id ? (
                    <span className="text-sm text-ink/55">Super admin</span>
                  ) : (
                  <form action={changeRole} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    {/*
                      key includes the role so React remounts the select when
                      the server value changes. Without it, an uncontrolled
                      select keeps whatever the user picked — so a rejected
                      change (e.g. demoting the last super admin) would keep
                      displaying the new role even though nothing was saved.
                    */}
                    <select
                      key={`${u.id}-${u.role}`}
                      name="role"
                      defaultValue={u.role}
                      className="rounded-lg border border-black/15 bg-white px-2 py-1 text-sm"
                    >
                      <option value="superadmin">Super admin</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold text-ink/70 transition hover:bg-soft-gray"
                    >
                      Save
                    </button>
                  </form>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.isOwner && u.id !== me.id ? (
                    <span className="text-xs text-ink/40">Owner only</span>
                  ) : (
                    <ResetPasswordForm userId={u.id} label={u.name || u.email} />
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id === me.id || u.isOwner ? (
                    <span className="text-xs text-ink/40">—</span>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <form action={removeUser}>
                        <input type="hidden" name="id" value={u.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                        >
                          Remove
                        </button>
                      </form>
                      {me.isOwner && u.role === "superadmin" && (
                        <form action={makeOwner}>
                          <input type="hidden" name="id" value={u.id} />
                          <button
                            type="submit"
                            className="text-xs font-semibold text-ink/45 hover:text-berkeley-blue"
                          >
                            Make owner
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-2xl">
        <h2 className="mb-4 font-serif text-xl text-ink">Add someone</h2>
        <Card>
          <AddUserForm />
        </Card>
      </div>
    </AdminShell>
  );
}
