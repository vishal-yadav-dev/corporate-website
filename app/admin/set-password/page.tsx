import { Suspense } from "react";
import SetPasswordForm from "./SetPasswordForm";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-paper text-graphite">Loading…</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}
