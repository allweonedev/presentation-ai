/**
 * Shared utility functions for PPT export
 */

/**
 * Get optimal pixelRatio for image capture based on device capability
 * Uses 2x for low-end devices to reduce memory usage and improve performance
 * Uses 3x for high-end devices for best quality
 */
export function getOptimalPixelRatio(): number {
  // Check device memory (Chrome/Edge only)
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (deviceMemory && deviceMemory <= 4) {
    return 2; // Low memory device
  }

  // Check CPU cores
  const hardwareConcurrency = navigator.hardwareConcurrency;
  if (hardwareConcurrency && hardwareConcurrency <= 4) {
    return 2; // Limited CPU
  }

  return 3; // High-end device
}
