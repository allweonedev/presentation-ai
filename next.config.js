/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Only import env.js if not skipping validation (to avoid build-time hangs)
if (!process.env.SKIP_ENV_VALIDATION) {
  await import("./src/env.js");
}

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
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
};

export default config;
