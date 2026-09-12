import { createFileRoute } from "@tanstack/react-router";
import { PuterGate } from "@/components/puter-gate";
import { Workspace } from "@/components/workspace";
import { PuterAuthProvider } from "@/lib/puter-auth";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <PuterAuthProvider>
      <PuterGate>
        <Workspace />
      </PuterGate>
    </PuterAuthProvider>
  );
}
