import { Buffer } from "buffer";
import { type ClassValue, clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a consistent date key string in YYYY-MM-DD format
 * This ensures timezone-independent date operations
 * @param date The date to create a key for
 * @returns A string in YYYY-MM-DD format
 */
export function getConsistentDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeJsonParse(
  jsonString: string,
): Record<string, unknown> | null {
  try {
    return JSON.parse(jsonString) as Record<string, unknown>;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // or you can return a default value
  }
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

export function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}

export const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  });
};

export function capitalizeFirstLetter(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const units = ["k", "M", "B", "T"];
  const unitIndex = Math.floor(Math.log10(num) / 3) - 1;
  const formattedNum = (num / 1000 ** (unitIndex + 1)).toFixed(1);

  return `${formattedNum}${units[unitIndex]}`;
}

export const formatMarketCap = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} T`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)} B`;
  } else {
    return `${value.toFixed(2)} M`;
  }
};

export function getInitials(name: string): string {
  // Split the name by spaces to get individual words
  const words = name.split(" ");
  // Map over the words array, extracting the first letter of each word and converting it to uppercase
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  // Join the initials into a single string
  return initials.join("");
}

export async function convertImagesToBase64(
  images: globalThis.File | globalThis.File[],
) {
  images = Array.isArray(images) ? images : [images];

  const base64Images = await Promise.all(
    images.map(async (image) => {
      const arrayBuffer = await image.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = image.type; // Get MIME type from the file object
      return `data:${mimeType};base64,${base64String}`;
    }),
  );
  return base64Images;
}

export function formatAnswer(answer: string, isLoading: boolean): string {
  let formattedAnswer = answer;

  // Remove leading ```markdown if present
  if (formattedAnswer.startsWith("```markdown")) {
    formattedAnswer = formattedAnswer.split("```markdown")[1] ?? "";
  }

  // Remove trailing ``` only if not loading
  if (!isLoading && formattedAnswer.endsWith("```")) {
    formattedAnswer = formattedAnswer.slice(0, -3);
  }

  return formattedAnswer;
}

export function formatCamelCase(str: string): string {
  // Add space before capital letters and capitalize the first letter
  const formatted = str
    // Add space before capital letters
    .replace(/([A-Z])/g, " $1")
    // Trim any leading space and capitalize first letter
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

  return formatted;
}

/**
 * Checks if an array has any duplicate elements
 * @param array The array to check for duplicates
 * @returns true if array contains duplicates, false otherwise
 */
export function hasDuplicates<T>(array: T[]): boolean {
  // For empty arrays or single-element arrays, return false immediately
  if (!array || array.length <= 1) {
    return false;
  }

  // For primitive types (strings, numbers, booleans), use Set for efficiency
  if (
    array.every(
      (item) =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean" ||
        item === null ||
        item === undefined,
    )
  ) {
    return new Set(array).size !== array.length;
  }

  // For arrays with objects or nested structures, use a more thorough comparison
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (isEqual(array[i], array[j])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper function to check if two values are equal
 * Handles primitive types and objects (shallow comparison)
 */
function isEqual(a: unknown, b: unknown): boolean {
  // Handle primitive types
  if (a === b) return true;

  // If either value is not an object or is null, they're not equal
  if (
    a == null ||
    b == null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  // Check if both are arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    // Compare array elements
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }

    return true;
  }

  // For regular objects, compare properties
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => Object.hasOwn(b, key) && isEqual(a[key], b[key]));
}

/**
 * Generate a unique token for use in invitations and other secure links
 */
export async function generateUniqueToken(length = 32): Promise<string> {
  // Using nanoid for secure, URL-friendly unique tokens
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
}

export function getDateRange(start: Date, end: Date) {
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

export const fetchJSON = async (url: string, next?: NextFetchRequestConfig) => {
  const response = await fetch(url, { next: next });
  if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
  return response.json();
};

export const extractOrigin = (url: string): string => {
  const hostname = new URL(url).hostname;
  return hostname.replace(/^www\./, "");
};
