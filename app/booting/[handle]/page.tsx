"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BootScreen } from "@/skins/boot-screen";

function BootingScreen() {
  const { handle } = useParams<{ handle: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const cardId = searchParams.get("id") ?? handle;

  return (
    <BootScreen
      id={cardId}
      onComplete={() => router.replace(`/${handle}?from=boot`)}
    />
  );
}

export default function BootingPage() {
  return (
    <Suspense>
      <BootingScreen />
    </Suspense>
  );
}
