"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import ScoresClient from "@/components/ScoresClient";
import { Modal } from "@/components/ui/Modal";

export default function ScoresModal() {
  const router = useRouter();

  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      title="Score History"
      maxWidth="max-w-4xl"
    >
      <Suspense
        fallback={<p className="text-center py-4">Loading scores...</p>}
      >
        <ScoresClient />
      </Suspense>
    </Modal>
  );
}
