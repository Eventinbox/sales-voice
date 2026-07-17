import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <h1 className="text-big-number font-extrabold text-primary">404</h1>
      <p className="text-body-lg text-on-surface-variant mt-4 mb-8">This page doesn&apos;t exist.</p>
      <Link href="/dashboard" className="bg-primary text-on-primary h-[56px] inline-flex items-center px-8 rounded-market font-bold text-label-lg">
        Go to Dashboard
      </Link>
    </div>
  );
}
