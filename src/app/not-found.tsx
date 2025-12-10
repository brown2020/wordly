import Link from "next/link";
import { BUTTON } from "@/constants/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">404</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h3>
        <p className="text-gray-600 mb-6">
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
