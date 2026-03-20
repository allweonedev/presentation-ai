import {
  type Descendant,
  type TColumnElement,
  type TColumnGroupElement,
  type TTableCellElement,
  type TTableElement,
  type TTableRowElement,
  type TText,
} from "platejs";
import {
  AREA_CHART_ELEMENT,
  BAR_CHART_ELEMENT,
  LINE_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  QUOTE_ELEMENT,
  RADAR_CHART_ELEMENT,
  SCATTER_CHART_ELEMENT,
} from "../editor/lib";
import {
  type TArrowListElement,
  type TArrowListItemElement,
} from "../editor/plugins/arrow-plugin";
import {
  type TBeforeAfterGroupElement,
  type TBeforeAfterSideElement,
} from "../editor/plugins/before-after-plugin";
import {
  type TBoxGroupElement,
  type TBoxItemElement,
} from "../editor/plugins/box-plugin";
import {
  type TBulletGroupElement,
  type TBulletItemElement,
} from "../editor/plugins/bullet-plugin";
import { type TButtonElement } from "../editor/plugins/button-plugin";
import {
  type TCompareGroupElement,
  type TCompareSideElement,
} from "../editor/plugins/compare-plugin";
import {
  type TCycleGroupElement,
  type TCycleItemElement,
} from "../editor/plugins/cycle-plugin";
import {
  type TIconListElement,
  type TIconListItemElement,
} from "../editor/plugins/icon-list-plugin";
import { type TIconElement } from "../editor/plugins/icon-plugin";
import {
  type TConsItemElement,
  type TProsConsGroupElement,
  type TProsItemElement,
} from "../editor/plugins/pros-cons-plugin";
import {
  type TPyramidGroupElement,
  type TPyramidItemElement,
} from "../editor/plugins/pyramid-plugin";
import { type TQuoteElement } from "../editor/plugins/quote-plugin";
import {
  type TSequenceArrowGroupElement,
  type TSequenceArrowItemElement,
} from "../editor/plugins/sequence-arrow-plugin";
import {
  type TStairGroupElement,
  type TStairItemElement,
} from "../editor/plugins/staircase-plugin";
import {
  type TStatsGroupElement,
  type TStatsItemElement,
} from "../editor/plugins/stats-plugin";
import {
  type TTimelineGroupElement,
  type TTimelineItemElement,
} from "../editor/plugins/timeline-plugin";
import { type PlateNode, type PlateSlide } from "./parser";
import {
  type HeadingElement,
  type ImageElement,
  type ParagraphElement,
  type TChartElement,
} from "./types";

/**
 * Class to serialize PlateSlide objects back to XML format
 */
export class SlideSerializer {
  /**
   * Serialize an array of PlateSlide objects to XML string
   * @param slides Array of PlateSlide objects
   * @param includePresentationWrapper Whether to wrap output in PRESENTATION tag
   * @returns XML string
   */
  public serializeSlides(
    slides: PlateSlide[],
    includePresentationWrapper = true,
  ): string {
    const sections = slides.map((slide) => this.serializeSlide(slide));

    if (includePresentationWrapper) {
      return `<PRESENTATION>\n${sections.join("\n")}\n</PRESENTATION>`;
    }

    return sections.join("\n");
  }

  /**
   * Serialize a single PlateSlide to XML SECTION
   */
  private serializeSlide(slide: PlateSlide): string {
    const attributes: Record<string, string> = {};

    // Add layout type if present
    if (slide.layoutType) {
      attributes.layout = slide.layoutType;
    }

    // Add alignment if present and not default
    if (slide.alignment && slide.alignment !== "center") {
      attributes.alignment = slide.alignment;
    }

    // Add bgColor if present
    if (slide.bgColor) {
      attributes.bgColor = slide.bgColor;
    }

    // Add width if present
    if (slide.width) {
      attributes.width = slide.width;
    }

    if (slide.id) {
      attributes.id = slide.id;
    }

    if (slide.isImageSlide) {
      attributes.isImageSlide = "true";
    }

    const attrString = this.serializeAttributes(attributes);
    const openTag = `<SECTION${attrString}>`;

    const contentParts: string[] = [];

    // Serialize content nodes
    if (!slide.isImageSlide) {
      for (const node of slide.content) {
        const serialized = this.serializeNode(node, 1);
        if (serialized) {
          contentParts.push(serialized);
        }
      }
    }

    // Add root image at the end if present
    if (slide.rootImage) {
      const imgAttrs: Record<string, string> = {
        query: slide.rootImage.query,
      };

      if (slide.rootImage.url) {
        imgAttrs.url = slide.rootImage.url;
      }

      if (slide.rootImage.layoutType) {
        imgAttrs.layoutType = slide.rootImage.layoutType;
      }

      if (slide.rootImage.size?.w) {
        imgAttrs.width = slide.rootImage.size.w;
      }

      if (slide.rootImage.size?.h) {
        imgAttrs.height = slide.rootImage.size.h.toString();
      }

      contentParts.push(`  <IMG${this.serializeAttributes(imgAttrs)} />`);
    }

    return `${openTag}\n${contentParts.join("\n")}\n</SECTION>`;
  }

  /**
   * Serialize attributes object to string
   */
  private serializeAttributes(attributes: Record<string, string>): string {
    const entries = Object.entries(attributes);
    if (entries.length === 0) return "";

    return (
      " " +
      entries
        .map(([key, value]) => `${key}="${this.escapeXml(value)}"`)
        .join(" ")
    );
  }

  /**
   * Escape special XML characters
   */
  private escapeXml(text: string): string {
    return text
      ?.replace(/&/g, "&amp;")
      ?.replace(/</g, "&lt;")
      ?.replace(/>/g, "&gt;")
      ?.replace(/"/g, "&quot;")
      ?.replace(/'/g, "&apos;");
  }

  /**
   * Serialize a PlateNode to XML
   */
  private serializeNode(node: PlateNode, indent = 0): string | null {
    if (!node || typeof node !== "object") return null;

    const nodeType = (node as { type?: string }).type;

    if (!nodeType) return null;

    switch (nodeType) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return this.serializeHeading(
          node as HeadingElement,
          nodeType.toUpperCase(),
          indent,
        );

      case "p":
        return this.serializeParagraph(node as ParagraphElement, indent);

      case "img":
        return this.serializeImage(node as ImageElement, indent);

      case "column_group":
        return this.serializeColumns(node as TColumnGroupElement, indent);

      case "bullets":
        return this.serializeBullets(node as TBulletGroupElement, indent);

      case "icons":
        return this.serializeIcons(node as TIconListElement, indent);

      case "cycle":
        return this.serializeCycle(node as TCycleGroupElement, indent);

      case "staircase":
        return this.serializeStaircase(node as TStairGroupElement, indent);

      case "arrows":
        return this.serializeArrows(node as TArrowListElement, indent);

      case "pyramid":
        return this.serializePyramid(node as TPyramidGroupElement, indent);

      case "timeline":
        return this.serializeTimeline(node as TTimelineGroupElement, indent);

      case "boxes":
        return this.serializeBoxes(node as TBoxGroupElement, indent);

      case "compare":
        return this.serializeCompare(node as TCompareGroupElement, indent);

      case "before-after":
        return this.serializeBeforeAfter(
          node as TBeforeAfterGroupElement,
          indent,
        );

      case "pros-cons":
        return this.serializeProsCons(node as TProsConsGroupElement, indent);

      case "arrow-vertical":
        return this.serializeArrowVertical(
          node as TSequenceArrowGroupElement,
          indent,
        );

      case "table":
        return this.serializeTable(node as TTableElement, indent);

      case "button":
        return this.serializeButton(node as TButtonElement, indent);

      case "stats":
        return this.serializeStats(node as TStatsGroupElement, indent);

      case PIE_CHART_ELEMENT:
      case BAR_CHART_ELEMENT:
      case AREA_CHART_ELEMENT:
      case RADAR_CHART_ELEMENT:
      case SCATTER_CHART_ELEMENT:
      case LINE_CHART_ELEMENT:
        return this.serializeChart(node as TChartElement, nodeType, indent);

      case QUOTE_ELEMENT:
        return this.serializeQuote(node as TQuoteElement, indent);

      default:
        console.warn(`Unknown node type: ${nodeType}`);
        return null;
    }
  }

  /**
   * Serialize heading element
   */
  private serializeHeading(
    node: HeadingElement,
    tag: string,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const content = this.serializeDescendants(node.children);
    return `${indentStr}<${tag}>${content}</${tag}>`;
  }

  /**
   * Serialize paragraph element
   */
  private serializeParagraph(node: ParagraphElement, indent: number): string {
    const indentStr = "  ".repeat(indent);

    // Check if this is a list item (has indent and listStyleType)
    const nodeWithList = node as ParagraphElement & {
      indent?: number;
      listStyleType?: string;
    };

    if (nodeWithList.indent && nodeWithList.listStyleType) {
      const content = this.serializeDescendants(node.children);
      return `${indentStr}<LI>${content}</LI>`;
    }

    const content = this.serializeDescendants(node.children);
    return `${indentStr}<P>${content}</P>`;
  }

  /**
   * Serialize image element
   */
  private serializeImage(node: ImageElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const attributes: Record<string, string> = {
      query: node.query,
    };

    if (node.url) {
      attributes.url = node.url;
    }

    // Add any additional properties as attributes
    const nodeKeys = Object.keys(node) as (keyof ImageElement)[];
    for (const key of nodeKeys) {
      if (
        key !== "type" &&
        key !== "children" &&
        key !== "query" &&
        key !== "url"
      ) {
        const value = node[key];
        if (value !== undefined && value !== null) {
          attributes[key] = String(value);
        }
      }
    }

    return `${indentStr}<IMG${this.serializeAttributes(attributes)} />`;
  }

  /**
   * Serialize columns layout
   */
  private serializeColumns(node: TColumnGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const columns = (node.children as TColumnElement[])
      .map((col) => {
        const content = (col.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        const attrs: Record<string, string> = {};
        if (col.width && col.width !== "M") {
          attrs.width = col.width;
        }

        return `${childIndentStr}<DIV${this.serializeAttributes(attrs)}>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<COLUMNS>\n${columns}\n${indentStr}</COLUMNS>`;
  }

  /**
   * Serialize bullets layout
   */
  private serializeBullets(node: TBulletGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const bullets = (node.children as TBulletItemElement[])
      .map((bullet) => {
        const content = (bullet.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<BULLETS>\n${bullets}\n${indentStr}</BULLETS>`;
  }

  /**
   * Serialize icons layout
   */
  private serializeIcons(node: TIconListElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const icons = (node.children as TIconListItemElement[])
      .map((item) => {
        const itemWithIcon = item as TIconListItemElement & { icon?: string };
        const itemIcon =
          itemWithIcon.icon ??
          this.getLegacyIconValue(item.children as Descendant[]);
        const parts: string[] = [];

        for (const child of item.children as Descendant[]) {
          if (
            typeof child === "object" &&
            "type" in child &&
            child.type === "icon"
          ) {
            continue;
          } else {
            const serialized = this.serializeDescendant(child, childIndent + 1);
            if (serialized) parts.push(serialized);
          }
        }

        const itemAttrs: Record<string, string> = {};

        if (itemIcon) {
          itemAttrs.icon = itemIcon;
        }

        return `${childIndentStr}<DIV${this.serializeAttributes(itemAttrs)}>\n${parts.join("\n")}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<ICONS>\n${icons}\n${indentStr}</ICONS>`;
  }

  private getLegacyIconValue(children: Descendant[]): string | undefined {
    for (const child of children) {
      if (
        typeof child === "object" &&
        "type" in child &&
        child.type === "icon"
      ) {
        const iconNode = child as TIconElement;
        return iconNode.name || iconNode.query || undefined;
      }
    }

    return undefined;
  }

  /**
   * Serialize cycle layout
   */
  private serializeCycle(node: TCycleGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TCycleItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<CYCLE>\n${items}\n${indentStr}</CYCLE>`;
  }

  /**
   * Serialize staircase layout
   */
  private serializeStaircase(node: TStairGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TStairItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<STAIRCASE>\n${items}\n${indentStr}</STAIRCASE>`;
  }

  /**
   * Serialize arrows layout
   */
  private serializeArrows(node: TArrowListElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TArrowListItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<ARROWS>\n${items}\n${indentStr}</ARROWS>`;
  }

  /**
   * Serialize pyramid layout
   */
  private serializePyramid(node: TPyramidGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TPyramidItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<PYRAMID>\n${items}\n${indentStr}</PYRAMID>`;
  }

  /**
   * Serialize timeline layout
   */
  private serializeTimeline(
    node: TTimelineGroupElement,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TTimelineItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<TIMELINE>\n${items}\n${indentStr}</TIMELINE>`;
  }

  /**
   * Serialize boxes layout
   */
  private serializeBoxes(node: TBoxGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TBoxItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<BOXES>\n${items}\n${indentStr}</BOXES>`;
  }

  /**
   * Serialize compare layout
   */
  private serializeCompare(node: TCompareGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const sides = (node.children as TCompareSideElement[])
      .map((side) => {
        const content = (side.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<COMPARE>\n${sides}\n${indentStr}</COMPARE>`;
  }

  /**
   * Serialize before/after layout
   */
  private serializeBeforeAfter(
    node: TBeforeAfterGroupElement,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const sides = (node.children as TBeforeAfterSideElement[])
      .map((side) => {
        const content = (side.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<BEFORE-AFTER>\n${sides}\n${indentStr}</BEFORE-AFTER>`;
  }

  /**
   * Serialize pros/cons layout
   */
  private serializeProsCons(
    node: TProsConsGroupElement,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as (TProsItemElement | TConsItemElement)[])
      .map((item) => {
        const isPros = item.type === "pros-item";
        const tag = isPros ? "PROS" : "CONS";

        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<${tag}>\n${content}\n${childIndentStr}</${tag}>`;
      })
      .join("\n");

    return `${indentStr}<PROS-CONS>\n${items}\n${indentStr}</PROS-CONS>`;
  }

  /**
   * Serialize arrow vertical layout
   */
  private serializeArrowVertical(
    node: TSequenceArrowGroupElement,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const items = (node.children as TSequenceArrowItemElement[])
      .map((item) => {
        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<ARROW-VERTICAL>\n${items}\n${indentStr}</ARROW-VERTICAL>`;
  }

  /**
   * Serialize stats layout
   */
  private serializeStats(node: TStatsGroupElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const childIndent = indent + 1;
    const childIndentStr = "  ".repeat(childIndent);

    const attrs: Record<string, string> = {};
    if (node.statsType && node.statsType !== "plain") {
      attrs.statstype = node.statsType;
    }

    const items = (node.children as TStatsItemElement[])
      .map((item) => {
        const itemAttrs: Record<string, string> = {};
        if (item.stat) {
          itemAttrs.stat = item.stat;
        }

        const content = (item.children as Descendant[])
          .map((child) => this.serializeDescendant(child, childIndent + 1))
          .filter(Boolean)
          .join("\n");

        return `${childIndentStr}<DIV${this.serializeAttributes(itemAttrs)}>\n${content}\n${childIndentStr}</DIV>`;
      })
      .join("\n");

    return `${indentStr}<STATS${this.serializeAttributes(attrs)}>\n${items}\n${indentStr}</STATS>`;
  }

  /**
   * Serialize table
   */
  private serializeTable(node: TTableElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const rowIndent = indent + 1;
    const rowIndentStr = "  ".repeat(rowIndent);
    const cellIndent = indent + 2;
    const cellIndentStr = "  ".repeat(cellIndent);

    const rows = (node.children as TTableRowElement[])
      .map((row) => {
        const cells = (row.children as TTableCellElement[])
          .map((cell) => {
            const isHeader = cell.type === "th";
            const tag = isHeader ? "TH" : "TD";

            const attrs: Record<string, string> = {};

            // Add colspan, rowspan, background as attributes
            const cellWithProps = cell as TTableCellElement & {
              colSpan?: number;
              rowSpan?: number;
              background?: string;
            };

            if (cellWithProps.colSpan && cellWithProps.colSpan > 1) {
              attrs.colspan = String(cellWithProps.colSpan);
            }
            if (cellWithProps.rowSpan && cellWithProps.rowSpan > 1) {
              attrs.rowspan = String(cellWithProps.rowSpan);
            }
            if (cellWithProps.background) {
              attrs.background = cellWithProps.background;
            }

            const content = (cell.children as Descendant[])
              .map((child) => this.serializeDescendant(child, 0))
              .filter(Boolean)
              .join("");

            return `${cellIndentStr}<${tag}${this.serializeAttributes(attrs)}>${content}</${tag}>`;
          })
          .join("\n");

        return `${rowIndentStr}<TR>\n${cells}\n${rowIndentStr}</TR>`;
      })
      .join("\n");

    return `${indentStr}<TABLE>\n${rows}\n${indentStr}</TABLE>`;
  }

  /**
   * Serialize button
   */
  private serializeButton(node: TButtonElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const attrs: Record<string, string> = {};

    const buttonWithProps = node as TButtonElement & {
      variant?: "filled" | "outline" | "ghost";
      size?: "sm" | "md" | "lg";
    };

    if (buttonWithProps.variant) {
      attrs.variant = buttonWithProps.variant;
    }
    if (buttonWithProps.size) {
      attrs.size = buttonWithProps.size;
    }

    const content = this.serializeDescendants(node.children);

    return `${indentStr}<BUTTON${this.serializeAttributes(attrs)}>${content}</BUTTON>`;
  }

  /**
   * Serialize chart
   */
  private serializeChart(
    node: TChartElement,
    elementType: string,
    indent: number,
  ): string {
    const indentStr = "  ".repeat(indent);
    const dataIndent = indent + 1;
    const dataIndentStr = "  ".repeat(dataIndent);

    // Map element type to chart type
    const typeMap: Record<string, string> = {
      [PIE_CHART_ELEMENT]: "pie",
      [BAR_CHART_ELEMENT]: "bar",
      [AREA_CHART_ELEMENT]: "area",
      [RADAR_CHART_ELEMENT]: "radar",
      [SCATTER_CHART_ELEMENT]: "scatter",
      [LINE_CHART_ELEMENT]: "line",
    };

    const chartType = typeMap[elementType] || "bar";

    const attrs: Record<string, string> = {
      charttype: chartType,
    };

    // Serialize data
    const dataRows: string[] = [];

    if (chartType === "scatter") {
      const scatterData = node.data as unknown as Array<{
        x: number;
        y: number;
      }>;
      if (Array.isArray(scatterData)) {
        for (const point of scatterData) {
          dataRows.push(
            `${dataIndentStr}<DATA x="${point.x}" y="${point.y}" />`,
          );
        }
      }
    } else {
      const chartData = node.data as Array<{ label: string; value: number }>;
      if (Array.isArray(chartData)) {
        for (const row of chartData) {
          dataRows.push(
            `${dataIndentStr}<DATA label="${this.escapeXml(row.label)}" value="${row.value}" />`,
          );
        }
      }
    }

    if (dataRows.length === 0) {
      return `${indentStr}<CHART${this.serializeAttributes(attrs)} />`;
    }

    return `${indentStr}<CHART${this.serializeAttributes(attrs)}>\n${dataRows.join("\n")}\n${indentStr}</CHART>`;
  }

  /**
   * Serialize a descendant (could be text or element)
   */
  private serializeDescendant(
    descendant: Descendant,
    indent: number,
  ): string | null {
    if (!descendant || typeof descendant !== "object") return null;

    // Check if it's a text node
    if ("text" in descendant) {
      return this.serializeTextNode(descendant as TText, indent);
    }

    // It's an element node
    return this.serializeNode(descendant as PlateNode, indent);
  }

  /**
   * Serialize descendants (array)
   */
  private serializeDescendants(descendants: Descendant[]): string {
    return descendants
      .map((d) => this.serializeDescendant(d, 0))
      .filter(Boolean)
      .join("");
  }

  /**
   * Serialize text node with formatting
   */
  private serializeTextNode(node: TText, indent: number): string {
    const indentStr = indent > 0 ? "  ".repeat(indent) : "";
    let text = node.text;

    // Escape the text
    text = this.escapeXml(text);

    const textWithFormat = node as TText & {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikethrough?: boolean;
    };

    // Apply formatting tags
    if (textWithFormat.bold) {
      text = `<B>${text}</B>`;
    }
    if (textWithFormat.italic) {
      text = `<I>${text}</I>`;
    }
    if (textWithFormat.underline) {
      text = `<U>${text}</U>`;
    }
    if (textWithFormat.strikethrough) {
      text = `<S>${text}</S>`;
    }

    return indent > 0 ? indentStr + text : text;
  }

  /**
   * Serialize quote element
   */
  private serializeQuote(node: TQuoteElement, indent: number): string {
    const indentStr = "  ".repeat(indent);
    const attrs: Record<string, string> = {};

    if (node.variant && node.variant !== "large") {
      attrs.variant = node.variant;
    }
    if (node.author) {
      attrs.author = node.author;
    }

    const content = this.serializeDescendants(node.children);
    return `${indentStr}<QUOTE${this.serializeAttributes(attrs)}>${content}</QUOTE>`;
  }
}

/**
 * Helper function to serialize slides to XML
 * @param slides Array of PlateSlide objects
 * @param includePresentationWrapper Whether to wrap in PRESENTATION tag
 * @returns XML string
 */
export function serializeSlidesToXml(
  slides: PlateSlide[],
  includePresentationWrapper = true,
): string {
  const serializer = new SlideSerializer();
  return serializer.serializeSlides(slides, includePresentationWrapper);
}

/**
 * Helper function to serialize a single slide to XML
 * @param slide PlateSlide object
 * @returns XML string
 */
export function serializeSlideToXml(slide: PlateSlide): string {
  const serializer = new SlideSerializer();
  return serializer.serializeSlides([slide], false);
}
