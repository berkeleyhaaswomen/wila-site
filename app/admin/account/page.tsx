import { requireUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { Card } from "@/components/admin/Field";
import ChangePasswordForm from "./ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser("/admin/account");

  return (
    <AdminShell user={user} current="/admin/account" title="Your account">
      <div className="max-w-xl space-y-6">
        <Card>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Email</dt>
              <dd className="font-semibold text-ink">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Name</dt>
              <dd className="font-semibold text-ink">{user.name || "Not set"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Role</dt>
              <dd className="font-semibold text-ink">
                {user.role === "superadmin" ? "Super admin" : "Admin"}
              </dd>
            </div>
          </dl>
        </Card>

        <div>
          <h2 className="mb-4 font-serif text-xl text-ink">Change your password</h2>
          <Card>
            <ChangePasswordForm />
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
