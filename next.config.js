/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  serverExternalPackages: [
    "@agentpond/files-sdk",
    "@agentpond/otel",
    "@arizeai/openinference-instrumentation-langchain",
    "@opentelemetry/sdk-node",
    "files-sdk",
  ],
};

export default config;
