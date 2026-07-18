"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <h1 className="text-big-number font-extrabold text-error">Error</h1>
      <p className="text-body-lg text-on-surface-variant mt-4 mb-8">Something went wrong. Please try again.</p>
      <button onClick={reset} className="bg-primary text-on-primary h-[56px] inline-flex items-center px-8 rounded-market font-bold text-label-lg">
        Try Again
      </button>
    </div>
  );
}
