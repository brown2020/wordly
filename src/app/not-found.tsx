import Link from "next/link";
import { BUTTON } from "@/constants/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="mb-2 text-2xl font-bold text-neutral-800">404</h2>
        <h3 className="mb-4 text-xl font-semibold text-neutral-700">
          Page Not Found
        </h3>
        <p className="mb-6 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className={`${BUTTON.primary} block w-full text-center`}
          >
            Return to Home
          </Link>
          <Link
            href="/scores"
            className={`${BUTTON.secondary} block w-full text-center`}
          >
            View Scores
          </Link>
        </div>
      </div>
    </div>
  );
}
