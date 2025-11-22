"use client";

import { getPresentation } from "@/app/_actions/presentation/presentationActions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SharedPresentationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: presentationData, isLoading, error } = useQuery({
    queryKey: ["shared-presentation", id],
    queryFn: async () => {
      const result = await getPresentation(id);
      if (!result.success || !result.presentation) {
        throw new Error(result.message ?? "Failed to load presentation");
      }
      // Check if presentation is public
      if (!result.presentation.isPublic) {
        throw new Error("This presentation is not publicly shared");
      }
      return result.presentation;
    },
    enabled: !!id,
    retry: false,
  });

  // Redirect to regular presentation view if valid
  useEffect(() => {
    if (presentationData && !isLoading && !error) {
      // Redirect to the normal presentation view
      router.push(`/presentation/${id}`);
    }
  }, [presentationData, isLoading, error, id, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error || !presentationData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <ExternalLink className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Presentation Not Available</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "This presentation is not publicly shared or does not exist."}
          </p>
        </div>
        <Button asChild variant="default">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-background">
      {/* Header with presentation info */}
      <div className="absolute left-0 right-0 top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold truncate max-w-md">
              {presentationData.title}
            </h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              Shared
            </span>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ExternalLink className="mr-2 h-4 w-4" />
              Create Your Own
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading state while redirecting */}
      <div className="flex h-full w-full items-center justify-center pt-14">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Redirecting to presentation...</p>
        </div>
      </div>
    </div>
  );
}
