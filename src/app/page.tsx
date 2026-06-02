import { redirect } from "next/navigation";

export default function LandingPage() {
  // Mobile-first approach: Bypass the marketing landing page and go straight to the app dashboard
  redirect("/dashboard");
}
