import { AppShell } from "@/components/layout/app-shell";
import { BiometricLockProvider } from "@/components/shared/biometric-lock";
import { UpdateNotifier } from "@/components/shared/update-notifier";
import { AnimatedSplash } from "@/components/shared/animated-splash";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UpdateNotifier />
      <AnimatedSplash />
      <BiometricLockProvider>
        <AppShell>{children}</AppShell>
      </BiometricLockProvider>
    </>
  );
}
