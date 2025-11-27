"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { ErrorView } from "@/components/views/ErrorView";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <ErrorView
      title="Oops! Spilled the Curry"
      message="Hey Chef, something went wrong in the kitchen."
      isError={true}
      reset={reset}
    />
  );
}
