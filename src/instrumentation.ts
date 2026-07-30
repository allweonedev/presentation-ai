export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { startAgentPond } = await import(
    "@/lib/observability/server/agentpond"
  );
  await startAgentPond();
}
