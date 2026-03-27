type RequireOptionalIntegrationParams = {
  integration: string;
  envVar: string;
  value: string | undefined | null;
  feature: string;
};

type OptionalIntegrationSuccess = {
  ok: true;
  value: string;
};

type OptionalIntegrationFailure = {
  ok: false;
  error: string;
};

export function requireOptionalIntegration({
  integration,
  envVar,
  value,
  feature,
}: RequireOptionalIntegrationParams):
  | OptionalIntegrationSuccess
  | OptionalIntegrationFailure {
  if (typeof value !== "string" || value.trim().length === 0) {
    return {
      ok: false,
      error: `${integration} is not configured. Set ${envVar} to enable ${feature}.`,
    };
  }

  return {
    ok: true,
    value,
  };
}
