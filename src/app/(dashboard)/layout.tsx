import { AppShell } from "@/components/layout/app-shell";
import { BiometricLockProvider } from "@/components/shared/biometric-lock";
import { UpdateNotifier } from "@/components/shared/update-notifier";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BiometricLockProvider>
      <UpdateNotifier />
      <AppShell>{children}</AppShell>
    </BiometricLockProvider>
  );
}
