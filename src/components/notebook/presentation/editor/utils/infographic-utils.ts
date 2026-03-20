/**
 * Infographic syntax utilities for template conversion
 */

import {
  INFOGRAPHIC_CATEGORIES,
  type InfographicDataField,
} from "@/constants/antv-templates";
import { type Data, type InfographicOptions } from "@antv/infographic";

/**
 * Parse the current template name from infographic syntax
 * Format: "infographic <template-id>\n..."
 */
export function parseInfographicTemplate(syntax: string): string | null {
  if (!syntax?.trim()) return null;

  const lines = syntax.trim().split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("infographic ")) {
      return trimmed.slice("infographic ".length).trim();
    }
  }

  return null;
}

/**
 * Replace the template in infographic syntax while preserving everything else
 * @param syntax The full infographic DSL syntax
 * @param newTemplate The new template ID to use
 * @returns Updated syntax with new template
 */
export function changeInfographicTemplate(
  syntax: string,
  newTemplate: string,
): string {
  if (!syntax?.trim()) return syntax;

  const lines = syntax.split("\n");
  let replaced = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();
    if (trimmed.startsWith("infographic ")) {
      const match = line.match(/^\s*/);
      const prefix = match ? match[0] : "";
      lines[i] = `${prefix}infographic ${newTemplate}`;
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    // If no infographic line, prepend it
    return `infographic ${newTemplate}\n${syntax}`;
  }

  return lines.join("\n");
}

/**
 * Get main category from template ID
 * e.g., "chart-pie-donut-compact-card" -> "chart"
 */
export function getTemplateMainCategory(templateId: string): string {
  return templateId.split("-")[0] ?? "other";
}

type ThemeBlockRange = {
  start: number;
  end: number;
};

type ThemeUpdateOptions = {
  stylize?: string | null;
  palette?: string | string[] | null;
  colorBg?: string;
  baseTextFill?: string;
  itemLabelFill?: string;
};

const TOP_LEVEL_KEYWORDS = ["data", "design", "relations"];

function getIndentSize(line: string): number {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

function isTopLevelBlock(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (line.startsWith(" ") || line.startsWith("\t")) return false;
  return TOP_LEVEL_KEYWORDS.some((keyword) => trimmed.startsWith(keyword));
}

function findThemeBlockRange(lines: string[]): ThemeBlockRange | null {
  const start = lines.findIndex((line) => line.trim().startsWith("theme"));
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (isTopLevelBlock(lines[i]!)) {
      end = i;
      break;
    }
  }

  return { start, end };
}

function ensureThemeBlock(lines: string[]): ThemeBlockRange {
  const existing = findThemeBlockRange(lines);
  if (existing) return existing;

  const infographicIndex = lines.findIndex((line) =>
    line.trim().startsWith("infographic "),
  );
  const insertIndex = infographicIndex >= 0 ? infographicIndex + 1 : 0;
  lines.splice(insertIndex, 0, "theme", "  colorBg transparent");
  return { start: insertIndex, end: insertIndex + 2 };
}

function updateStylizeLine(
  lines: string[],
  themeRange: ThemeBlockRange,
  stylize: string | null | undefined,
): void {
  if (stylize === undefined) return;

  const keyPattern = /^\s{2}stylize\b/;
  const existingIndex = lines
    .slice(themeRange.start + 1, themeRange.end)
    .findIndex((line) => keyPattern.test(line));

  if (stylize === null) {
    // Remove stylize line if it exists
    if (existingIndex >= 0) {
      const absoluteIndex = themeRange.start + 1 + existingIndex;
      lines.splice(absoluteIndex, 1);
    }
    return;
  }

  // Add or update stylize line
  if (existingIndex >= 0) {
    const absoluteIndex = themeRange.start + 1 + existingIndex;
    lines[absoluteIndex] = `  stylize ${stylize}`;
    return;
  }

  // Insert after theme line
  const insertIndex = themeRange.start + 1;
  lines.splice(insertIndex, 0, `  stylize ${stylize}`);
}

function upsertTopLevelThemeLine(
  lines: string[],
  themeRange: ThemeBlockRange,
  key: string,
  value: string,
): void {
  const keyPattern = new RegExp(`^\\s{2}${key}\\b`);
  const existingIndex = lines
    .slice(themeRange.start + 1, themeRange.end)
    .findIndex((line) => keyPattern.test(line));

  if (existingIndex >= 0) {
    const absoluteIndex = themeRange.start + 1 + existingIndex;
    lines[absoluteIndex] = `  ${key} ${value}`;
    return;
  }

  const insertIndex = themeRange.start + 1;
  lines.splice(insertIndex, 0, `  ${key} ${value}`);
}

function removeIndentedBlock(
  lines: string[],
  startIndex: number,
  blockEnd: number,
): void {
  const baseIndent = getIndentSize(lines[startIndex]!);
  let endIndex = startIndex + 1;
  for (; endIndex < blockEnd; endIndex++) {
    const line = lines[endIndex]!;
    if (!line.trim()) continue;
    const indent = getIndentSize(line);
    if (indent <= baseIndent) break;
  }
  lines.splice(startIndex, endIndex - startIndex);
}

function upsertPaletteBlock(
  lines: string[],
  themeRange: ThemeBlockRange,
  palette: string | string[] | null | undefined,
): void {
  if (palette === undefined) return;

  const keyPattern = /^\s{2}palette\b/;
  const paletteIndex = lines
    .slice(themeRange.start + 1, themeRange.end)
    .findIndex((line) => keyPattern.test(line));

  if (paletteIndex >= 0) {
    const absoluteIndex = themeRange.start + 1 + paletteIndex;
    removeIndentedBlock(lines, absoluteIndex, themeRange.end);
  }

  if (palette === null) return;

  const currentThemeRange = findThemeBlockRange(lines) ?? themeRange;
  const colorBgIndex = lines
    .slice(currentThemeRange.start + 1, currentThemeRange.end)
    .findIndex((line) => /^\s{2}colorBg\b/.test(line));

  const insertIndex =
    colorBgIndex >= 0
      ? currentThemeRange.start + 2 + colorBgIndex
      : currentThemeRange.start + 1;

  if (Array.isArray(palette)) {
    const paletteLines = ["  palette", ...palette.map((c) => `    - ${c}`)];
    lines.splice(insertIndex, 0, ...paletteLines);
    return;
  }

  lines.splice(insertIndex, 0, `  palette ${palette}`);
}

function findBlockEnd(
  lines: string[],
  blockStart: number,
  blockEnd: number,
): number {
  const baseIndent = getIndentSize(lines[blockStart]!);
  for (let i = blockStart + 1; i < blockEnd; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;
    if (getIndentSize(line) <= baseIndent) return i;
  }
  return blockEnd;
}

function findChildBlockIndex(
  lines: string[],
  blockStart: number,
  blockEnd: number,
  childKey: string,
): number {
  const childIndent = getIndentSize(lines[blockStart]!) + 2;
  for (let i = blockStart + 1; i < blockEnd; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;
    if (getIndentSize(line) < childIndent) break;
    if (
      getIndentSize(line) === childIndent &&
      line.trim().startsWith(childKey)
    ) {
      return i;
    }
  }
  return -1;
}

function upsertNestedThemeValue(
  lines: string[],
  themeRange: ThemeBlockRange,
  path: string[],
  key: string,
  value: string,
): void {
  let currentStart = themeRange.start;
  let currentEnd = themeRange.end;

  for (const segment of path) {
    const childIndex = findChildBlockIndex(
      lines,
      currentStart,
      currentEnd,
      segment,
    );
    if (childIndex === -1) {
      const insertAt = findBlockEnd(lines, currentStart, currentEnd);
      lines.splice(
        insertAt,
        0,
        `${" ".repeat(getIndentSize(lines[currentStart]!) + 2)}${segment}`,
      );
      currentStart = insertAt;
      currentEnd = findThemeBlockRange(lines)?.end ?? lines.length;
    } else {
      currentStart = childIndex;
    }

    currentEnd = findBlockEnd(lines, currentStart, currentEnd);
  }

  const valueIndent = getIndentSize(lines[currentStart]!) + 2;
  const keyPattern = new RegExp(`^\\s{${valueIndent}}${key}\\b`);
  let existingIndex = -1;

  for (let i = currentStart + 1; i < currentEnd; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;
    const indent = getIndentSize(line);
    if (indent < valueIndent) break;
    if (indent === valueIndent && keyPattern.test(line)) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex >= 0) {
    lines[existingIndex] = `${" ".repeat(valueIndent)}${key} ${value}`;
    return;
  }

  lines.splice(currentEnd, 0, `${" ".repeat(valueIndent)}${key} ${value}`);
}

export function updateInfographicTheme(
  syntax: string,
  options: ThemeUpdateOptions,
): string {
  if (!syntax?.trim()) return syntax;

  const lines = syntax.split("\n");
  let themeRange = ensureThemeBlock(lines);

  // Ensure theme line is just "theme" (no theme name)
  lines[themeRange.start] = "theme";

  updateStylizeLine(lines, themeRange, options.stylize);
  themeRange = findThemeBlockRange(lines) ?? themeRange;

  if (options.colorBg) {
    upsertTopLevelThemeLine(lines, themeRange, "colorBg", options.colorBg);
    themeRange = findThemeBlockRange(lines) ?? themeRange;
  }

  upsertPaletteBlock(lines, themeRange, options.palette);
  themeRange = findThemeBlockRange(lines) ?? themeRange;

  if (options.baseTextFill) {
    upsertNestedThemeValue(
      lines,
      themeRange,
      ["base", "text"],
      "fill",
      options.baseTextFill,
    );
    themeRange = findThemeBlockRange(lines) ?? themeRange;
  }

  if (options.itemLabelFill) {
    upsertNestedThemeValue(
      lines,
      themeRange,
      ["item", "label"],
      "fill",
      options.itemLabelFill,
    );
  }

  return lines.join("\n");
}

export function parseInfographicStylize(syntax: string): string | null {
  if (!syntax?.trim()) return null;
  const lines = syntax.split("\n");
  const themeRange = findThemeBlockRange(lines);
  if (!themeRange) return null;

  // Search for stylize line in theme block (new format)
  for (let i = themeRange.start + 1; i < themeRange.end; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;
    if (/^\s{2}stylize\b/.test(line)) {
      const parts = line.trim().split(/\s+/);
      return parts.length > 1 ? parts.slice(1).join(" ") : null;
    }
  }

  // Also check for legacy "theme hand-drawn" format for backwards compatibility
  const themeLine = lines[themeRange.start]?.trim() ?? "";
  if (themeLine === "theme hand-drawn") {
    return "rough";
  }

  return null;
}

export function parseInfographicPalette(
  syntax: string,
): string | string[] | null {
  if (!syntax?.trim()) return null;
  const lines = syntax.split("\n");
  const themeRange = findThemeBlockRange(lines);
  if (!themeRange) return null;

  for (let i = themeRange.start + 1; i < themeRange.end; i++) {
    const line = lines[i]!;
    if (!line.trim()) continue;
    if (/^\s{2}palette\b/.test(line)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 1) {
        return parts.slice(1).join(" ");
      }

      const paletteItems: string[] = [];
      const baseIndent = getIndentSize(line);
      for (let j = i + 1; j < themeRange.end; j++) {
        const nextLine = lines[j]!;
        if (!nextLine.trim()) continue;
        const indent = getIndentSize(nextLine);
        if (indent <= baseIndent) break;
        const trimmed = nextLine.trim();
        if (trimmed.startsWith("-")) {
          paletteItems.push(trimmed.replace(/^-\s*/, "").trim());
        }
      }

      return paletteItems.length > 0 ? paletteItems : null;
    }
  }

  return null;
}

/**
 * Force-replaces or inserts theme block right after the infographic line
 * Expected format:
 * infographic <template>
 * theme [dark]
 *   colorBg transparent
 *   base
 *     text
 *       color <css-var>
 *   item
 *     label
 *       fill <css-var>
 * data
 *   ...
 */
export function applyThemeToSyntax(syntax: string, isDark: boolean): string {
  if (!syntax?.trim()) return syntax;

  const colors = getInfographicThemeColors(isDark);

  return updateInfographicTheme(syntax, {
    colorBg: colors.colorBg,
    baseTextFill: colors.baseTextFill,
    itemLabelFill: colors.itemLabelFill,
  });
}

export function getInfographicThemeColors(isDark: boolean) {
  return {
    colorBg: "transparent",
    baseTextFill: isDark ? "#FFFFFF" : "#000000",
    itemLabelFill: isDark ? "#E5E5E5" : "#404040",
  };
}

export interface InfographicThemeConfig {
  colorBg?: string;
  base?: {
    text?: {
      fill?: string;
    };
  };
  item?: {
    label?: {
      fill?: string;
    };
  };
  [key: string]: unknown;
}

export function applyThemeToData(
  data: Partial<InfographicOptions>,
  isDark: boolean,
): Partial<InfographicOptions> {
  if (!data || typeof data !== "object") return data;

  const colors = getInfographicThemeColors(isDark);

  // Create a deep clone to avoid mutating the original object
  // Create a deep clone to avoid mutating the original object
  const newData = JSON.parse(JSON.stringify(data)) as InfographicOptions;

  // Ensure themeConfig structure exists
  if (!newData.themeConfig) {
    newData.themeConfig = {};
  }

  const themeConfig = newData.themeConfig;

  if (!themeConfig.base) {
    themeConfig.base = {};
  }
  if (!themeConfig.base.text) {
    themeConfig.base.text = {};
  }
  if (!themeConfig.item) {
    themeConfig.item = {};
  }
  if (!themeConfig.item.label) {
    themeConfig.item.label = {};
  }

  // Apply colors
  themeConfig.colorBg = colors.colorBg;
  themeConfig.base!.text!.fill = colors.baseTextFill;
  themeConfig.item!.label!.fill = colors.itemLabelFill;

  return newData as unknown as Partial<InfographicOptions>;
}

// ============================================================================
// DATA CONVERSION UTILITIES
// ============================================================================

/**
 * Data field types supported by infographic templates
 */
export type DataFieldType = InfographicDataField;

/**
 * Base data item structure (common fields across all types)
 */
export interface DataItem {
  label?: string;
  desc?: string;
  value?: number | string;
  icon?: string;
  id?: string;
  group?: string;
  category?: string;
  children?: DataItem[];
}

/**
 * Parsed data block structure
 */
export interface ParsedDataBlock {
  title?: string;
  desc?: string;
  order?: string;
  items: DataItem[];
  relations?: string[];
  sourceField: DataFieldType;
}

/**
 * Map template category to expected data field
 */
export function getExpectedDataField(categoryKey: string): DataFieldType {
  return (
    INFOGRAPHIC_CATEGORIES.find((category) => category.key === categoryKey)
      ?.dataField ?? "items"
  );
}

/**
 * Detect which data field is used in the syntax
 */
function detectDataField(dataBlockContent: string): DataFieldType {
  const fieldPatterns: Array<[DataFieldType, RegExp]> = [
    ["lists", /^\s{2}lists\s*$/m],
    ["sequences", /^\s{2}sequences\s*$/m],
    ["values", /^\s{2}values\s*$/m],
    ["compares", /^\s{2}compares\s*$/m],
    ["root", /^\s{2}root\s*$/m],
    ["nodes", /^\s{2}nodes\s*$/m],
    ["items", /^\s{2}items\s*$/m],
  ];

  for (const [field, pattern] of fieldPatterns) {
    if (pattern.test(dataBlockContent)) {
      return field;
    }
  }

  return "items";
}

/**
 * Parse a data item from indented lines
 */
function parseDataItem(
  lines: string[],
  startIndex: number,
): { item: DataItem; endIndex: number } {
  const item: DataItem = {};
  let i = startIndex;
  const baseIndent = lines[i]!.search(/\S/);

  // First line should start with "- "
  const firstLine = lines[i]!.trim();
  if (firstLine.startsWith("- ")) {
    const afterDash = firstLine.slice(2).trim();
    // Check if it's "- label Value" format
    if (afterDash.startsWith("label ")) {
      item.label = afterDash.slice(6).trim();
    } else if (afterDash.startsWith("id ")) {
      item.id = afterDash.slice(3).trim();
    } else if (afterDash) {
      item.label = afterDash;
    }
  }
  i++;

  // Parse subsequent property lines
  while (i < lines.length) {
    const line = lines[i];
    if (!line || line.trim() === "") {
      i++;
      continue;
    }

    const currentIndent = line.search(/\S/);

    // If we hit a line with same or less indent that starts with "-", we're done with this item
    if (currentIndent <= baseIndent && line.trim().startsWith("-")) {
      break;
    }

    // If we hit a top-level keyword, we're done
    if (currentIndent === 0 || currentIndent < baseIndent) {
      break;
    }

    const trimmed = line.trim();

    // Parse property lines
    if (trimmed.startsWith("label ")) {
      item.label = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("desc ")) {
      item.desc = trimmed.slice(5).trim();
    } else if (trimmed.startsWith("value ")) {
      const val = trimmed.slice(6).trim();
      item.value = Number.isNaN(Number(val)) ? val : Number(val);
    } else if (trimmed.startsWith("icon ")) {
      item.icon = trimmed.slice(5).trim();
    } else if (trimmed.startsWith("id ")) {
      item.id = trimmed.slice(3).trim();
    } else if (trimmed.startsWith("group ")) {
      item.group = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("category ")) {
      item.category = trimmed.slice(9).trim();
    } else if (trimmed === "children") {
      // Parse children recursively
      i++;
      const children: DataItem[] = [];
      while (i < lines.length) {
        const childLine = lines[i];
        if (!childLine || childLine.trim() === "") {
          i++;
          continue;
        }
        const childIndent = childLine.search(/\S/);
        if (childIndent <= currentIndent) break;

        if (childLine.trim().startsWith("-")) {
          const { item: childItem, endIndex } = parseDataItem(lines, i);
          children.push(childItem);
          i = endIndex;
        } else {
          i++;
        }
      }
      item.children = children;
      continue;
    }

    i++;
  }

  return { item, endIndex: i };
}

/**
 * Parse the root node for hierarchy data
 */
function parseRootNode(
  lines: string[],
  startIndex: number,
): { item: DataItem; endIndex: number } {
  const item: DataItem = {};
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    if (!line || line.trim() === "") {
      i++;
      continue;
    }

    const currentIndent = line.search(/\S/);

    // If we hit a top-level keyword (indent 0), we're done
    if (
      currentIndent === 0 &&
      !line.trim().startsWith("label") &&
      !line.trim().startsWith("children")
    ) {
      break;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("label ")) {
      item.label = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("desc ")) {
      item.desc = trimmed.slice(5).trim();
    } else if (trimmed === "children") {
      i++;
      const children: DataItem[] = [];
      while (i < lines.length) {
        const childLine = lines[i];
        if (!childLine || childLine.trim() === "") {
          i++;
          continue;
        }
        const childIndent = childLine.search(/\S/);
        // If indent is 0 or 2 (same as "children"), we're done with children
        if (childIndent <= 4 && !childLine.trim().startsWith("-")) break;

        if (childLine.trim().startsWith("-")) {
          const { item: childItem, endIndex } = parseDataItem(lines, i);
          children.push(childItem);
          i = endIndex;
        } else {
          i++;
        }
      }
      item.children = children;
      continue;
    }

    i++;
  }

  return { item, endIndex: i };
}

/**
 * Parse the data block from infographic syntax
 */
export function parseDataBlock(syntax: string): ParsedDataBlock | null {
  if (!syntax?.trim()) return null;

  // Find the data block
  const dataMatch = syntax.match(/^data\s*$/m);
  if (!dataMatch) return null;

  const dataStartIndex = dataMatch.index!;

  // Find the end of the data block (next top-level keyword or end of string)
  const afterData = syntax.slice(dataStartIndex);
  const nextBlockMatch = afterData.match(/\n(?=theme\s|design\s|relations\s)/);
  const dataBlockContent = nextBlockMatch
    ? afterData.slice(0, nextBlockMatch.index)
    : afterData;

  const lines = dataBlockContent.split("\n");
  const result: ParsedDataBlock = {
    items: [],
    relations: [],
    sourceField: detectDataField(dataBlockContent),
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }

    const trimmed = line.trim();

    // Parse top-level properties
    if (trimmed.startsWith("title ")) {
      result.title = trimmed.slice(6).trim();
    } else if (trimmed.startsWith("desc ")) {
      result.desc = trimmed.slice(5).trim();
    } else if (trimmed.startsWith("order ")) {
      result.order = trimmed.slice(6).trim();
    } else if (
      trimmed === "lists" ||
      trimmed === "sequences" ||
      trimmed === "values" ||
      trimmed === "compares" ||
      trimmed === "nodes" ||
      trimmed === "items"
    ) {
      // Parse items
      i++;
      while (i < lines.length) {
        const itemLine = lines[i];
        if (!itemLine || itemLine.trim() === "") {
          i++;
          continue;
        }

        // Check if we've hit a new top-level block
        const indent = itemLine.search(/\S/);
        if (indent === 0 || indent === 2) {
          // Could be a new field like "relations" or "order"
          if (!itemLine.trim().startsWith("-")) break;
        }

        if (itemLine.trim().startsWith("-")) {
          const { item, endIndex } = parseDataItem(lines, i);
          if (item.label || item.value !== undefined || item.id) {
            result.items.push(item);
          }
          i = endIndex;
        } else {
          i++;
        }
      }
      continue;
    } else if (trimmed === "relations") {
      // Parse relations under data block
      i++;
      while (i < lines.length) {
        const relLine = lines[i];
        if (!relLine || relLine.trim() === "") {
          i++;
          continue;
        }

        const indent = relLine.search(/\S/);
        if (indent === 0 || indent === 2) {
          if (!relLine.trim().startsWith("-")) break;
        }

        if (relLine.trim().startsWith("-")) {
          const relation = relLine.trim().slice(1).trim();
          if (relation) {
            result.relations!.push(relation);
          }
          i++;
        } else {
          i++;
        }
      }
      continue;
    } else if (trimmed === "root") {
      // Parse hierarchy root
      i++;
      const { item, endIndex } = parseRootNode(lines, i);
      if (item.label || item.children) {
        result.items = [item];
      }
      i = endIndex;
      continue;
    }

    i++;
  }

  // Parse relations block separately if it exists
  const relationsMatch = syntax.match(/^relations\s*$/m);
  if (relationsMatch) {
    const relationsStartIndex = relationsMatch.index!;
    const afterRelations = syntax.slice(relationsStartIndex);
    const relationsLines = afterRelations.split("\n").slice(1);

    for (const line of relationsLines) {
      if (!line.trim()) continue;
      if (line.search(/\S/) === 0) break; // Hit next top-level block

      const trimmed = line.trim();
      // Capture relation lines like "A -> B" or "A - label -> B"
      if (
        trimmed.includes("->") ||
        trimmed.includes("<-") ||
        trimmed.includes("--")
      ) {
        result.relations!.push(trimmed);
      }
    }
  }

  return result;
}

/**
 * Flatten hierarchy items to a flat list (breadth-first, no path formatting)
 */
function flattenHierarchy(items: DataItem[]): DataItem[] {
  const result: DataItem[] = [];
  const queue: DataItem[] = [...items];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const { children, ...rest } = node;
    if (rest.label || rest.value !== undefined || rest.id) {
      result.push(rest);
    }
    if (children?.length) {
      queue.push(...children);
    }
  }

  return result;
}

function hasNestedChildren(items: DataItem[]): boolean {
  for (const item of items) {
    if (item.children && item.children.length > 0) return true;
    if (item.children && hasNestedChildren(item.children)) return true;
  }
  return false;
}

/**
 * Convert flat list items to compare-binary format
 * Splits items into 2 groups, each group becomes children of a parent item
 */
function convertToCompareBinary(items: DataItem[]): DataItem[] {
  // Flatten any nested structure first
  const flat = flattenHierarchy(items);
  if (flat.length === 0) return [];

  // Split into two halves
  const mid = Math.ceil(flat.length / 2);
  const firstHalf = flat.slice(0, mid);
  const secondHalf = flat.slice(mid);

  // Create two parent items with children (no desc/icon on children, just label)
  const groupA: DataItem = {
    label: "Group A",
    value: firstHalf.length,
    children: firstHalf.map((item) => ({ label: item.label ?? "Item" })),
  };

  const groupB: DataItem = {
    label: "Group B",
    value: secondHalf.length,
    children: secondHalf.map((item) => ({ label: item.label ?? "Item" })),
  };

  return [groupA, groupB];
}

/**
 * Flatten compare items (with children) back to a flat list
 * Used when converting FROM compare templates TO other templates
 * Only extracts the children, ignores parent group items
 */
function flattenCompareItems(items: DataItem[]): DataItem[] {
  const result: DataItem[] = [];

  for (const item of items) {
    // Only extract children, ignore the parent item (Group A, Group B)
    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        const { children: _, ...rest } = child;
        result.push(rest);
      }
    }
    // If item has no children, it's probably already a flat item from a different source
    // In that case, only include it if it looks like actual content (not a Group label)
    else if (item.label && !item.label.startsWith("Group ")) {
      const { children: _, ...rest } = item;
      result.push(rest);
    }
  }

  return result;
}

/**
 * Convert flat items to hierarchy structure (first item becomes root, rest become children)
 */
function convertToHierarchy(items: DataItem[]): DataItem[] {
  if (items.length === 0) return [];

  const [first, ...rest] = items;
  return [
    {
      ...first,
      children: rest.map(({ children: _, ...item }) => item),
    },
  ];
}

/**
 * Serialize a single data item to syntax lines
 */
function serializeDataItem(item: DataItem, indent: number = 4): string[] {
  const pad = " ".repeat(indent);
  const lines: string[] = [];

  lines.push(`${pad}- label ${item.label ?? "Item"}`);

  if (item.value !== undefined) {
    lines.push(`${pad}  value ${item.value}`);
  }
  if (item.desc) {
    lines.push(`${pad}  desc ${item.desc}`);
  }
  if (item.icon) {
    lines.push(`${pad}  icon ${item.icon}`);
  }
  if (item.id) {
    lines.push(`${pad}  id ${item.id}`);
  }
  if (item.group) {
    lines.push(`${pad}  group ${item.group}`);
  }
  if (item.category) {
    lines.push(`${pad}  category ${item.category}`);
  }
  if (item.children && item.children.length > 0) {
    lines.push(`${pad}  children`);
    for (const child of item.children) {
      lines.push(...serializeDataItem(child, indent + 4));
    }
  }

  return lines;
}

/**
 * Serialize hierarchy root structure
 */
function serializeRootNode(item: DataItem): string[] {
  const lines: string[] = [];

  lines.push("  root");
  if (item.label) {
    lines.push(`    label ${item.label}`);
  }
  if (item.desc) {
    lines.push(`    desc ${item.desc}`);
  }
  if (item.children && item.children.length > 0) {
    lines.push("    children");
    for (const child of item.children) {
      lines.push(...serializeDataItem(child, 6));
    }
  }

  return lines;
}

/**
 * Build a new data block from parsed data and target field type
 */
function buildDataBlock(
  parsed: ParsedDataBlock,
  targetField: DataFieldType,
): string {
  const lines: string[] = ["data"];

  if (parsed.title) {
    lines.push(`  title ${parsed.title}`);
  }
  if (parsed.desc) {
    lines.push(`  desc ${parsed.desc}`);
  }

  let items = parsed.items;

  // Convert items based on target field
  if (targetField === "root") {
    // Convert to hierarchy
    if (parsed.sourceField !== "root") {
      items = convertToHierarchy(items);
    }
    if (items.length > 0) {
      lines.push(...serializeRootNode(items[0]!));
    }
  } else {
    // For all other types, flatten if coming from hierarchy or nested children exist
    // But skip flattening for compares field to preserve children structure
    if (
      targetField !== "compares" &&
      (parsed.sourceField === "root" || hasNestedChildren(items))
    ) {
      items = flattenHierarchy(items);
    }

    // Add the field name
    lines.push(`  ${targetField}`);

    // Serialize items
    for (const item of items) {
      lines.push(...serializeDataItem(item));
    }
  }

  // For sequences, preserve order if present
  if (targetField === "sequences" && parsed.order) {
    lines.push(`  order ${parsed.order}`);
  }

  return lines.join("\n");
}

function slugifyId(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeNodeIds(items: DataItem[]): DataItem[] {
  const used = new Set<string>();

  return items.map((item, idx) => {
    const raw = String(item.id ?? item.label ?? `node-${idx + 1}`);
    let id = slugifyId(raw) || `node-${idx + 1}`;

    const base = id;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);

    // keep label as-is, but ensure a safe id
    return { ...item, id, children: undefined };
  });
}

/** Leaves-only flatten (prevents internal/group nodes from becoming extra nodes) */
function flattenHierarchyLeaves(items: DataItem[]): DataItem[] {
  const out: DataItem[] = [];

  const walk = (node: DataItem) => {
    if (!node.children || node.children.length === 0) {
      const { children: _, ...rest } = node;
      out.push(rest);
      return;
    }
    for (const ch of node.children) walk(ch);
  };

  for (const n of items) walk(n);
  return out;
}

/**
 * Build relation data block with nodes + relations inside data.
 * Nodes use safe ids; relations are unlabeled simple connections.
 */
function buildRelationDataBlock(
  parsed: ParsedDataBlock,
  relations: string[],
): string {
  const lines: string[] = ["data"];

  if (parsed.title) lines.push(`  title ${parsed.title}`);
  if (parsed.desc) lines.push(`  desc ${parsed.desc}`);

  // get source items
  let items = parsed.items;

  // IMPORTANT: hierarchy → only leaves (avoid “extra” internal/group nodes)
  if (parsed.sourceField === "root") {
    items = flattenHierarchyLeaves(items);
  } else if (hasNestedChildren(items)) {
    // if anything nested sneaks in, also leaves-only (keeps it stable)
    items = flattenHierarchyLeaves(items);
  }

  // normalize ids
  const nodes = normalizeNodeIds(items);

  lines.push("  nodes");
  for (const node of nodes) {
    // write "- id ..." so the relation engine uses stable IDs
    const pad = " ".repeat(4);
    lines.push(`${pad}- id ${node.id}`);
    lines.push(`${pad}  label ${node.label ?? node.id}`);

    if (node.value !== undefined) lines.push(`${pad}  value ${node.value}`);
    if (node.desc) lines.push(`${pad}  desc ${node.desc}`);
    if (node.icon) lines.push(`${pad}  icon ${node.icon}`);
    if (node.group) lines.push(`${pad}  group ${node.group}`);
    if (node.category) lines.push(`${pad}  category ${node.category}`);
  }

  if (relations.length > 0) {
    lines.push("  relations");
    for (const r of relations) lines.push(`    - ${r}`);
  }

  return lines.join("\n");
}

/**
 * Build hierarchy data using items with a single root that contains children.
 */
function buildHierarchyItemsDataBlock(parsed: ParsedDataBlock): string {
  const lines: string[] = ["data"];

  if (parsed.title) {
    lines.push(`  title ${parsed.title}`);
  }
  if (parsed.desc) {
    lines.push(`  desc ${parsed.desc}`);
  }

  let items = parsed.items;
  if (parsed.sourceField !== "root") {
    items = convertToHierarchy(items);
  }

  lines.push("  items");
  if (items.length > 0) {
    lines.push(...serializeDataItem(items[0]!));
  }

  return lines.join("\n");
}

/**
 * Convert infographic syntax data from one template category to another
 */
export function convertInfographicData(
  syntax: string,
  fromTemplate: string,
  toTemplate: string,
): string {
  if (!syntax?.trim()) return syntax;

  const fromCategory = getTemplateMainCategory(fromTemplate);
  const toCategory = getTemplateMainCategory(toTemplate);

  // If same category, just change the template name
  if (fromCategory === toCategory) {
    return changeInfographicTemplate(syntax, toTemplate);
  }

  // Parse the data block
  const parsed = parseDataBlock(syntax);
  if (!parsed || parsed.items.length === 0) {
    // No data to convert, just change template
    return changeInfographicTemplate(syntax, toTemplate);
  }

  // Get target data field
  const targetField = getExpectedDataField(toCategory);

  // Special handling for relation templates (items + relations inside data)
  if (toCategory === "relation") {
    // Always force a simple chain; ignore existing relations to avoid surprises.
    let items = parsed.items;

    if (parsed.sourceField === "root") items = flattenHierarchyLeaves(items);
    else if (hasNestedChildren(items)) items = flattenHierarchyLeaves(items);

    const nodes = normalizeNodeIds(items);

    // simple unlabeled line connections (no arrows): "--"
    const relations =
      nodes.length >= 2
        ? nodes.slice(0, -1).map((n, idx) => `${n.id} -- ${nodes[idx + 1]!.id}`)
        : [];

    // overwrite parsed.items with normalized nodes so builder uses same ids
    parsed.items = nodes;

    const relationDataBlock = buildRelationDataBlock(parsed, relations);

    const themeMatch = syntax.match(
      /^theme(\s+\w+)?[\s\S]*?(?=^(?:data|design|relations)\s|$)/m,
    );
    const themeBlock = themeMatch ? themeMatch[0].trim() : "";

    const designMatch = syntax.match(
      /^design[\s\S]*?(?=^(?:data|theme|relations)\s|$)/m,
    );
    const designBlock = designMatch ? designMatch[0].trim() : "";

    const parts = [`infographic ${toTemplate}`];
    if (themeBlock) parts.push(themeBlock);
    if (designBlock) parts.push(designBlock);
    parts.push(relationDataBlock);

    return parts.join("\n");
  }

  // Special handling for compare-binary templates (need 2 items with children)
  const isCompareBinary = toTemplate.startsWith("compare-binary-");
  if (isCompareBinary) {
    // Flatten source items if coming from compare or hierarchy
    let items = parsed.items;
    if (parsed.sourceField === "compares" || fromCategory === "compare") {
      items = flattenCompareItems(items);
    } else if (parsed.sourceField === "root" || hasNestedChildren(items)) {
      items = flattenHierarchy(items);
    }

    // Convert to compare-binary format
    const compareItems = convertToCompareBinary(items);
    parsed.items = compareItems;

    // Build data block with compares field
    const newDataBlock = buildDataBlock(parsed, "compares");

    const themeMatch = syntax.match(
      /^theme(\s+\w+)?[\s\S]*?(?=^(?:data|design|relations)\s|$)/m,
    );
    const themeBlock = themeMatch ? themeMatch[0].trim() : "";

    const designMatch = syntax.match(
      /^design[\s\S]*?(?=^(?:data|theme|relations)\s|$)/m,
    );
    const designBlock = designMatch ? designMatch[0].trim() : "";

    const parts = [`infographic ${toTemplate}`];
    if (themeBlock) parts.push(themeBlock);
    if (designBlock) parts.push(designBlock);
    parts.push(newDataBlock);

    return parts.join("\n");
  }

  // When converting FROM compare to non-compare, flatten compare items first
  if (fromCategory === "compare" && toCategory !== "compare") {
    if (parsed.sourceField === "compares" || hasNestedChildren(parsed.items)) {
      parsed.items = flattenCompareItems(parsed.items);
    }
  }

  // Build new data block
  let newDataBlock = "";
  if (toCategory === "hierarchy") {
    newDataBlock = buildHierarchyItemsDataBlock(parsed);
  } else {
    newDataBlock = buildDataBlock(parsed, targetField);
  }

  // Extract theme block if present
  const themeMatch = syntax.match(
    /^theme(\s+\w+)?[\s\S]*?(?=^(?:data|design|relations)\s|$)/m,
  );
  const themeBlock = themeMatch ? themeMatch[0].trim() : "";

  // Extract design block if present
  const designMatch = syntax.match(
    /^design[\s\S]*?(?=^(?:data|theme|relations)\s|$)/m,
  );
  const designBlock = designMatch ? designMatch[0].trim() : "";

  // Rebuild complete syntax
  const parts = [`infographic ${toTemplate}`];

  if (themeBlock) {
    parts.push(themeBlock);
  }
  if (designBlock) {
    parts.push(designBlock);
  }

  parts.push(newDataBlock);

  return parts.join("\n");
}

type RelationEdge = {
  from?: string;
  to?: string;
  label?: string;
  direction?: "forward" | "both" | "none";
};

function resolveDataFieldFromOptions(data: Data): DataFieldType {
  if ("root" in data && data.root) return "root";
  if ("nodes" in data && Array.isArray(data.nodes) && data.nodes.length > 0)
    return "nodes";
  if (
    "relations" in data &&
    Array.isArray(data.relations) &&
    data.relations.length > 0
  )
    return "nodes";
  if (
    "compares" in data &&
    Array.isArray(data.compares) &&
    data.compares.length > 0
  )
    return "compares";
  if ("lists" in data && Array.isArray(data.lists) && data.lists.length > 0)
    return "lists";
  if (
    "sequences" in data &&
    Array.isArray(data.sequences) &&
    data.sequences.length > 0
  )
    return "sequences";
  if ("values" in data && Array.isArray(data.values) && data.values.length > 0)
    return "values";
  if ("items" in data && Array.isArray(data.items) && data.items.length > 0)
    return "items";
  return "items";
}

function toDataItem(item: unknown): DataItem {
  if (!item || typeof item !== "object") {
    return {};
  }

  const candidate = item as DataItem;
  const normalized: DataItem = {
    label: candidate.label,
    desc: candidate.desc,
    value: candidate.value,
    icon: candidate.icon,
    id: candidate.id,
    group: candidate.group,
    category: candidate.category,
  };

  if (Array.isArray(candidate.children) && candidate.children.length > 0) {
    normalized.children = candidate.children.map(toDataItem);
  }

  return normalized;
}

function getItemsFromOptions(data: Data, field: DataFieldType): DataItem[] {
  if (field === "root") {
    const root =
      ("root" in data && data.root) ||
      ("items" in data && Array.isArray(data.items)
        ? data.items[0]
        : undefined);
    return root ? [toDataItem(root)] : [];
  }

  if (field === "nodes") {
    const nodes =
      ("nodes" in data && Array.isArray(data.nodes) && data.nodes.length > 0
        ? data.nodes
        : undefined) ??
      ("items" in data && Array.isArray(data.items) ? data.items : []);
    return nodes.map(toDataItem);
  }

  if (field === "compares") {
    const compares =
      ("compares" in data &&
      Array.isArray(data.compares) &&
      data.compares.length > 0
        ? data.compares
        : undefined) ??
      ("items" in data && Array.isArray(data.items) ? data.items : []);
    return compares.map(toDataItem);
  }

  if (field === "lists") {
    const lists =
      ("lists" in data && Array.isArray(data.lists) && data.lists.length > 0
        ? data.lists
        : undefined) ??
      ("items" in data && Array.isArray(data.items) ? data.items : []);
    return lists.map(toDataItem);
  }

  if (field === "sequences") {
    const sequences =
      ("sequences" in data &&
      Array.isArray(data.sequences) &&
      data.sequences.length > 0
        ? data.sequences
        : undefined) ??
      ("items" in data && Array.isArray(data.items) ? data.items : []);
    return sequences.map(toDataItem);
  }

  if (field === "values") {
    const values =
      ("values" in data && Array.isArray(data.values) && data.values.length > 0
        ? data.values
        : undefined) ??
      ("items" in data && Array.isArray(data.items) ? data.items : []);
    return values.map(toDataItem);
  }

  const items = "items" in data && Array.isArray(data.items) ? data.items : [];
  return items.map(toDataItem);
}

function relationEdgeToSyntax(edge: RelationEdge): string | null {
  const from = edge.from?.trim();
  const to = edge.to?.trim();
  if (!from || !to) return null;

  let connector = "->";
  if (edge.direction === "none") connector = "--";
  if (edge.direction === "both") connector = "<->";

  if (edge.label?.trim()) {
    return `${from} - ${edge.label.trim()} ${connector} ${to}`;
  }

  return `${from} ${connector} ${to}`;
}

function buildDataBlockFromOptions(data: Data): string {
  const field = resolveDataFieldFromOptions(data);
  const items = getItemsFromOptions(data, field);
  const relations =
    "relations" in data && Array.isArray(data.relations)
      ? (data.relations as RelationEdge[])
          .map(relationEdgeToSyntax)
          .filter((line): line is string => Boolean(line))
      : [];

  const parsed: ParsedDataBlock = {
    title: "title" in data ? (data.title as string | undefined) : undefined,
    desc: "desc" in data ? (data.desc as string | undefined) : undefined,
    order: "order" in data ? (data.order as string | undefined) : undefined,
    items,
    relations,
    sourceField: field,
  };

  if (field === "nodes") {
    return buildRelationDataBlock(parsed, relations);
  }

  return buildDataBlock(parsed, field);
}

export function syncInfographicSyntaxWithData(
  syntax: string,
  options: Partial<InfographicOptions> | null | undefined,
): string {
  if (!options || !options.data) return syntax;

  const template = parseInfographicTemplate(syntax) ?? options.template ?? null;
  if (!template) return syntax;

  const dataBlock = buildDataBlockFromOptions(options.data);

  const themeMatch = syntax.match(
    /^theme(\s+\w+)?[\s\S]*?(?=^(?:data|design|relations)\s|$)/m,
  );
  const themeBlock = themeMatch ? themeMatch[0].trim() : "";

  const designMatch = syntax.match(
    /^design[\s\S]*?(?=^(?:data|theme|relations)\s|$)/m,
  );
  const designBlock = designMatch ? designMatch[0].trim() : "";

  const parts = [`infographic ${template}`];
  if (themeBlock) parts.push(themeBlock);
  if (designBlock) parts.push(designBlock);
  parts.push(dataBlock);

  return parts.join("\n");
}
