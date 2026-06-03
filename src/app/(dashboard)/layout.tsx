import { AppShell } from "@/components/layout/app-shell";
import { UpdateNotifier } from "@/components/shared/update-notifier";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UpdateNotifier />
      <AppShell>{children}</AppShell>
    </>
  );
}
