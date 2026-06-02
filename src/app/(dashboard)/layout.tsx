import { AppShell } from "@/components/layout/app-shell";
import { BiometricLockProvider } from "@/components/shared/biometric-lock";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BiometricLockProvider>
      <AppShell>{children}</AppShell>
    </BiometricLockProvider>
  );
}
