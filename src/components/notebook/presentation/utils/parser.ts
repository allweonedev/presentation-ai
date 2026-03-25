import { ColumnItemPlugin, ColumnPlugin } from "@platejs/layout/react";
import { nanoid } from "nanoid";
import {
  type Descendant,
  type TColumnElement,
  type TColumnGroupElement,
  type TText,
} from "platejs";
import {
  type TArrowListElement,
  type TArrowListItemElement,
} from "../editor/plugins/arrow-plugin";
import {
  type TBulletGroupElement,
  type TBulletItemElement,
} from "../editor/plugins/bullet-plugin";
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
  type TPyramidGroupElement,
  type TPyramidItemElement,
} from "../editor/plugins/pyramid-plugin";
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

import {
  type TTableCellElement,
  type TTableElement,
  type TTableRowElement,
} from "platejs";
import {
  AREA_CHART_ELEMENT,
  BAR_CHART_ELEMENT,
  BOX_PLOT_CHART_ELEMENT,
  CANDLESTICK_CHART_ELEMENT,
  LINE_CHART_ELEMENT,
  OHLC_CHART_ELEMENT,
  PIE_CHART_ELEMENT,
  QUOTE_ELEMENT,
  RADAR_CHART_ELEMENT,
  SCATTER_CHART_ELEMENT,
} from "../editor/lib";
import {
  type TBeforeAfterGroupElement,
  type TBeforeAfterSideElement,
} from "../editor/plugins/before-after-plugin";
import {
  type TBoxGroupElement,
  type TBoxItemElement,
} from "../editor/plugins/box-plugin";
import { type TButtonElement } from "../editor/plugins/button-plugin";
import {
  type TCompareGroupElement,
  type TCompareSideElement,
} from "../editor/plugins/compare-plugin";
import {
  type TConsItemElement,
  type TProsConsGroupElement,
  type TProsItemElement,
} from "../editor/plugins/pros-cons-plugin";
import { type TQuoteElement } from "../editor/plugins/quote-plugin";
import {
  type TSequenceArrowGroupElement,
  type TSequenceArrowItemElement,
} from "../editor/plugins/sequence-arrow-plugin";
import {
  type GeneratingText,
  type HeadingElement,
  type ImageCropSettings,
  type ImageElement,
  type ParagraphElement,
  type TChartElement,
} from "./types";

// Union type for all possible Plate elements
export type PlateNode =
  | ParagraphElement
  | HeadingElement
  | ImageElement
  | TColumnElement
  | TColumnGroupElement
  | TBulletGroupElement
  | TBulletItemElement
  | TIconListItemElement
  | TIconListElement
  | TIconElement
  | TCycleGroupElement
  | TCycleItemElement
  | TStairItemElement
  | TStairGroupElement
  | TPyramidGroupElement
  | TPyramidItemElement
  | TArrowListElement
  | TArrowListItemElement
  | TTimelineGroupElement
  | TTimelineItemElement
  | TChartElement
  | TBoxGroupElement
  | TBoxItemElement
  | TCompareGroupElement
  | TCompareSideElement
  | TBeforeAfterGroupElement
  | TBeforeAfterSideElement
  | TProsConsGroupElement
  | TProsItemElement
  | TConsItemElement
  | TSequenceArrowGroupElement
  | TSequenceArrowItemElement
  | TButtonElement
  | TTableElement
  | TTableRowElement
  | TTableCellElement
  | TQuoteElement;

export type LayoutType = "left" | "right" | "vertical" | "background" | "none";
export type RootImage = {
  query: string;
  url?: string;
  embedType?: string;
  imageSource?: "generate" | "search" | "gif";
  cropSettings?: ImageCropSettings;
  layoutType?: LayoutType;
  size?: { w?: string; h?: number };
  // Chart support
  chartType?: string;
  chartData?: unknown;
  chartOptions?: Record<string, unknown>;
};

export type PlateSlide = {
  id: string;
  content: PlateNode[];
  rootImage?: RootImage;
  layoutType?: LayoutType | undefined;
  alignment?: "start" | "center" | "end";
  bgColor?: string;
  width?: "S" | "M" | "L";
  fontSize?: "S" | "M" | "L";
  fontFamily?: {
    heading: string;
    body: string;
    headingUrl?: string;
    bodyUrl?: string;
    headingWeight?: number;
    bodyWeight?: number;
  };
  formatCategory?: "presentation" | "social" | "document" | "webpage";
  aspectRatio?: {
    type: "fluid" | "ratio" | "tall" | "preset";
    value?: string;
  };
  isImageSlide?: boolean;
};

// Updated XMLNode to support mixed content (text and elements interleaved)
interface XMLNode {
  tag: string;
  attributes: Record<string, string>;
  children: Array<XMLNode | XMLTextNode>;
  originalTagContent?: string;
}

interface XMLTextNode {
  text: string;
}

function isTextNode(node: XMLNode | XMLTextNode): node is XMLTextNode {
  return "text" in node && !("tag" in node);
}

function isElementNode(node: XMLNode | XMLTextNode): node is XMLNode {
  return "tag" in node;
}

/**
 * Class to parse XML presentation data into Plate.js format with improved streaming support
 */
export class SlideParser {
  private buffer = "";
  private completedSections: string[] = [];
  private parsedSlides: PlateSlide[] = [];
  private lastInputLength = 0;
  private sectionIdMap = new Map<string, string>();
  private latestContent = "";
  private sectionCounter = 0;

  /**
   * Parse a chunk of XML data
   */
  public parseChunk(chunk: string): PlateSlide[] {
    this.latestContent = chunk;

    const isFullContent =
      chunk.length >= this.lastInputLength &&
      chunk.substring(0, this.lastInputLength) ===
        this.buffer.substring(0, this.lastInputLength);

    if (isFullContent && this.lastInputLength > 0) {
      this.buffer = this.buffer + chunk.substring(this.lastInputLength);
    } else {
      this.buffer = chunk;
    }

    this.lastInputLength = chunk.length;
    this.extractCompleteSections();
    const newSlides = this.processSections();

    return newSlides;
  }

  /**
   * Finalize parsing with any remaining content
   */
  public finalize(): PlateSlide[] {
    try {
      this.extractCompleteSections();

      let remainingBuffer = this.buffer.trim();

      if (remainingBuffer.startsWith("<PRESENTATION")) {
        const tagEndIdx = remainingBuffer.indexOf(">");
        if (tagEndIdx !== -1) {
          remainingBuffer = remainingBuffer.substring(tagEndIdx + 1).trim();
        }
      }

      if (remainingBuffer.startsWith("<SECTION")) {
        const fixedSection = remainingBuffer + "</SECTION>";
        this.completedSections.push(fixedSection);
      }

      const finalSlides = this.processSections();
      this.latestContent = "";

      return finalSlides;
    } catch (e) {
      console.error("Error during finalization:", e);
      return [];
    }
  }

  /**
   * Get all parsed slides
   */
  public getAllSlides(): PlateSlide[] {
    return this.parsedSlides;
  }

  /**
   * Reset the parser state
   */
  public reset(): void {
    this.buffer = "";
    this.completedSections = [];
    this.parsedSlides = [];
    this.lastInputLength = 0;
    this.latestContent = "";
    this.sectionCounter = 0;
  }

  /**
   * Manually clear all generating marks from all slides
   */
  public clearAllGeneratingMarks(): void {
    for (const slide of this.parsedSlides) {
      this.clearGeneratingMarksFromNodes(slide.content as Descendant[]);
    }
    this.latestContent = "";
  }

  /**
   * Clear all generating marks from a tree of nodes
   */
  private clearGeneratingMarksFromNodes(nodes: Descendant[]): void {
    for (const node of nodes) {
      if ("text" in node && (node as GeneratingText).generating !== undefined) {
        (node as GeneratingText).generating = undefined;
      }

      if (
        "children" in node &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        this.clearGeneratingMarksFromNodes(node.children as Descendant[]);
      }
    }
  }

  /**
   * Process the completed sections into Plate slides
   */
  private processSections(): PlateSlide[] {
    if (this.completedSections.length === 0) {
      return [];
    }

    const newSlides = this.completedSections.map(this.convertSectionToPlate);
    this.parsedSlides = [...this.parsedSlides, ...newSlides];
    this.completedSections = [];

    return newSlides;
  }

  /**
   * Extract SECTION blocks from the buffer
   */
  private extractCompleteSections(): void {
    let startIdx = 0;
    let extractedSectionEndIdx = 0;

    const presentationStartIdx = this.buffer.indexOf("<PRESENTATION");
    if (presentationStartIdx !== -1 && presentationStartIdx < 10) {
      const tagEndIdx = this.buffer.indexOf(">", presentationStartIdx);
      if (tagEndIdx !== -1) {
        startIdx = tagEndIdx + 1;

        const commentStartIdx = this.buffer.indexOf("<!--", startIdx);
        if (commentStartIdx !== -1 && commentStartIdx < startIdx + 20) {
          const commentEndIdx = this.buffer.indexOf("-->", commentStartIdx);
          if (commentEndIdx !== -1) {
            startIdx = commentEndIdx + 3;
          }
        }
      }
    }

    while (true) {
      const sectionStartIdx = this.buffer.indexOf("<SECTION", startIdx);
      if (sectionStartIdx === -1) break;

      const sectionEndIdx = this.buffer.indexOf("</SECTION>", sectionStartIdx);
      const nextSectionIdx = this.buffer.indexOf(
        "<SECTION",
        sectionStartIdx + 1,
      );

      if (
        sectionEndIdx !== -1 &&
        (nextSectionIdx === -1 || sectionEndIdx < nextSectionIdx)
      ) {
        const completeSection = this.buffer.substring(
          sectionStartIdx,
          sectionEndIdx + "</SECTION>".length,
        );

        this.completedSections.push(completeSection);
        startIdx = sectionEndIdx + "</SECTION>".length;
        extractedSectionEndIdx = startIdx;
      } else if (nextSectionIdx !== -1) {
        const partialSection = this.buffer.substring(
          sectionStartIdx,
          nextSectionIdx,
        );

        if (
          partialSection.includes("<H1>") ||
          partialSection.includes("<H2>") ||
          partialSection.includes("<H3>") ||
          partialSection.includes("<PYRAMID>") ||
          partialSection.includes("<ARROWS>") ||
          partialSection.includes("<TIMELINE>") ||
          partialSection.includes("<P>") ||
          partialSection.includes("<ICON") ||
          partialSection.includes("<IMG")
        ) {
          this.completedSections.push(partialSection + "</SECTION>");
        }

        startIdx = nextSectionIdx;
        extractedSectionEndIdx = nextSectionIdx;
      } else {
        break;
      }
    }

    if (extractedSectionEndIdx > 0) {
      this.buffer = this.buffer.substring(extractedSectionEndIdx);
    }
  }

  /**
   * Generate a section identifier
   */
  private generateSectionIdentifier(sectionNode: XMLNode): string {
    // Position prefix ensures unique fingerprints for slides at different positions,
    // while maintaining stable IDs across re-parses during streaming
    const positionPrefix = `pos-${this.sectionCounter++}-`;

    const h1Node = sectionNode.children.find(
      (child) => isElementNode(child) && child.tag.toUpperCase() === "H1",
    ) as XMLNode | undefined;

    if (h1Node) {
      const headingContent = this.getTextContent(h1Node);
      if (headingContent.trim().length > 0) {
        return `${positionPrefix}heading-${headingContent.trim()}`;
      }
    }

    let fingerprint = "";

    const attrKeys = Object.keys(sectionNode.attributes).sort();
    if (attrKeys.length > 0) {
      fingerprint += attrKeys
        .map((key) => `${key}=${sectionNode.attributes[key]}`)
        .join(";");
    }

    const childTags = sectionNode.children
      .filter(isElementNode)
      .slice(0, 3)
      .map((child) => child.tag.toUpperCase());
    if (childTags.length > 0) {
      fingerprint += "|" + childTags.join("-");
    }

    if (fingerprint.length < 5) {
      let hash = 0;
      const fullContent = sectionNode.originalTagContent ?? "";
      for (let i = 0; i < fullContent.length; i++) {
        const char = fullContent.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      fingerprint = `content-hash-${Math.abs(hash)}`;
    }

    return `${positionPrefix}${fingerprint}`;
  }

  /**
   * Convert an XML section string to Plate.js format
   */
  private convertSectionToPlate = (sectionString: string): PlateSlide => {
    const rootNode = this.parseXML(sectionString);

    const sectionNode = rootNode.children.find(
      (child) => isElementNode(child) && child.tag.toUpperCase() === "SECTION",
    ) as XMLNode | undefined;

    if (!sectionNode) {
      return {
        id: nanoid(),
        content: [],
        layoutType: undefined,
        alignment: "center",
      };
    }

    let slideId: string;
    if (sectionNode.attributes.id) {
      slideId = sectionNode.attributes.id;
    } else {
      const sectionIdentifier = this.generateSectionIdentifier(sectionNode);

      if (this.sectionIdMap.has(sectionIdentifier)) {
        slideId = this.sectionIdMap.get(sectionIdentifier)!;
      } else {
        slideId = nanoid();
        this.sectionIdMap.set(sectionIdentifier, slideId);
      }
    }

    let layoutType: LayoutType | undefined;
    const layoutAttr = sectionNode.attributes.layout;

    if (layoutAttr) {
      if (
        layoutAttr === "left" ||
        layoutAttr === "right" ||
        layoutAttr === "vertical" ||
        layoutAttr === "background"
      ) {
        layoutType = layoutAttr as LayoutType;
      } else {
        layoutType = "left";
      }
    }

    // Check for isImageSlide attribute
    const isImageSlideAttr = sectionNode.attributes.isImageSlide;
    const isImageSlide =
      isImageSlideAttr === "true" || isImageSlideAttr === "1";

    const plateElements: PlateNode[] = [];
    let rootImage:
      | { query: string; url?: string; layoutType?: LayoutType }
      | undefined;

    for (const child of sectionNode.children) {
      if (!isElementNode(child)) continue;

      if (child.tag.toUpperCase() === "IMG") {
        if (child.originalTagContent) {
          // First try to get URL from parsed attributes
          let url = child.attributes.url ?? child.attributes.src ?? "";

          // If not found, extract URL from originalTagContent (handles streaming cases)
          if (!url) {
            // Try url= first, then src=
            for (const urlAttr of ["url=", "src="]) {
              const urlStart = child.originalTagContent.indexOf(urlAttr);
              if (urlStart !== -1) {
                const afterUrl = child.originalTagContent.substring(
                  urlStart + urlAttr.length,
                );
                if (afterUrl.length > 0) {
                  const quoteChar = afterUrl[0];
                  if (quoteChar === '"' || quoteChar === "'") {
                    const closingQuoteIdx = afterUrl.indexOf(quoteChar, 1);
                    if (closingQuoteIdx !== -1) {
                      url = afterUrl.substring(1, closingQuoteIdx);
                      break;
                    }
                  }
                }
              }
            }
          }

          const queryStart = child.originalTagContent.indexOf("query=");
          let isCompleteQuery = false;

          if (queryStart !== -1) {
            const afterQuery = child.originalTagContent.substring(
              queryStart + 6,
            );
            if (afterQuery.length > 0) {
              const quoteChar = afterQuery[0];
              if (quoteChar === '"' || quoteChar === "'") {
                const closingQuoteIdx = afterQuery.indexOf(quoteChar, 1);

                isCompleteQuery = closingQuoteIdx !== -1;

                if (isCompleteQuery) {
                  const extractedQuery = afterQuery.substring(
                    1,
                    closingQuoteIdx,
                  );

                  if (
                    extractedQuery &&
                    extractedQuery.trim().length > 0 &&
                    !rootImage
                  ) {
                    rootImage = {
                      query: extractedQuery,
                      layoutType,
                      ...(url ? { url } : {}),
                    };
                  }
                }
              }
            }
          } else if (url && !rootImage) {
            // If there's a URL but no query, still create the rootImage with just the URL
            rootImage = {
              query: "",
              layoutType,
              url,
            };
          }
        }
        continue;
      }

      if (child.tag.toUpperCase() === "DIV") {
        for (const divChild of child.children) {
          if (!isElementNode(divChild)) continue;
          const processedElement = this.processTopLevelNode(divChild);
          if (processedElement) {
            plateElements.push(processedElement);
          }
        }
      } else {
        const processedElement = this.processTopLevelNode(child);
        if (processedElement) {
          plateElements.push(processedElement);
        }
      }
    }

    return {
      id: slideId,
      content: plateElements,
      ...(rootImage ? { rootImage } : {}),
      ...(layoutType ? { layoutType: layoutType } : {}),
      ...(isImageSlide ? { isImageSlide: true } : {}),
      alignment: "center",
    };
  };

  /**
   * Process a top-level node in the SECTION
   */
  private processTopLevelNode(node: XMLNode): PlateNode | null {
    const tag = node.tag.toUpperCase();

    switch (tag) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
        return this.createHeading(
          tag.toLowerCase() as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
          node,
        );
      case "P":
        return this.createParagraph(node);
      case "IMG":
        return this.createImage(node);
      case "COLUMNS":
        return this.createColumns(node);
      case "BULLETS":
        return this.createBulletGroup(node);
      case "ICONS":
        return this.createIconList(node);
      case "CYCLE":
        return this.createCycle(node);
      case "STAIRCASE":
        return this.createStaircase(node);
      case "CHART":
        return this.createChart(node);
      case "ARROWS":
        return this.createArrowList(node);
      case "BOXES":
        return this.createBoxes(node);
      case "COMPARE":
        return this.createCompare(node);
      case "BEFORE-AFTER":
      case "BEFOREAFTER":
        return this.createBeforeAfter(node);
      case "PROS-CONS":
      case "PROSCONS":
        return this.createProsCons(node);
      case "ARROW-VERTICAL":
      case "ARROW_VERTICAL":
      case "VERTICAL-ARROWS":
      case "VERTICAL_ARROWS":
        return this.createArrowVertical(node);
      case "TABLE":
        return this.createPlainTable(node);
      case "BUTTON":
        return this.createButton(node);
      case "PYRAMID":
        return this.createPyramid(node);
      case "TIMELINE":
        return this.createTimeline(node);
      case "STATS":
        return this.createStats(node);
      case "QUOTE":
        return this.createQuote(node);
      default:
        console.warn(`Unknown top-level tag: ${tag}`);
        return null;
    }
  }

  /**
   * Parse XML string into a structured tree with mixed content
   */
  private parseXML(xmlString: string): XMLNode {
    const rootNode: XMLNode = {
      tag: "ROOT",
      attributes: {},
      children: [],
    };

    let processedXml = xmlString;

    const presentationOpenStart = processedXml.indexOf("<PRESENTATION");
    if (presentationOpenStart !== -1) {
      const presentationOpenEnd = processedXml.indexOf(
        ">",
        presentationOpenStart,
      );
      if (presentationOpenEnd !== -1) {
        processedXml =
          processedXml.substring(0, presentationOpenStart) +
          processedXml.substring(presentationOpenEnd + 1);
      }
    }

    processedXml = processedXml.replace("</PRESENTATION>", "");

    try {
      let fixedXml = processedXml;

      if (fixedXml.includes("<SECTION") && !fixedXml.endsWith("</SECTION>")) {
        fixedXml += "</SECTION>";
      }

      this.parseElement(fixedXml, rootNode);
    } catch (error) {
      console.error("Error parsing XML:", error);

      // Fall back to a very basic parser that just captures top level tags
      // First remove the PRESENTATION tags if present
      let withoutPresentation = xmlString;

      // Handle opening tag with possible attributes
      const presentationOpenStart =
        withoutPresentation.indexOf("<PRESENTATION");
      if (presentationOpenStart !== -1) {
        const presentationOpenEnd = withoutPresentation.indexOf(
          ">",
          presentationOpenStart,
        );
        if (presentationOpenEnd !== -1) {
          // Remove the entire opening tag including attributes
          withoutPresentation =
            withoutPresentation.substring(0, presentationOpenStart) +
            withoutPresentation.substring(presentationOpenEnd + 1);
        }
      }

      // Handle closing tag
      withoutPresentation = withoutPresentation.replace("</PRESENTATION>", "");

      const sections = withoutPresentation.split(/<\/?SECTION[^>]*>/);
      let inSection = false;

      for (const section of sections) {
        if (inSection && section.trim()) {
          // Create a synthetic section
          const sectionNode: XMLNode = {
            tag: "SECTION",
            attributes: {},
            children: [],
          };

          rootNode.children.push(sectionNode);
        }
        inSection = !inSection;
      }
    }

    return rootNode;
  }

  /**
   * Enhanced parser that maintains order of text and elements
   */
  private parseElement(xml: string, parentNode: XMLNode): void {
    let currentIndex = 0;

    while (currentIndex < xml.length) {
      const tagStart = xml.indexOf("<", currentIndex);

      // No more tags, add remaining text
      if (tagStart === -1) {
        const remainingText = xml.substring(currentIndex);
        if (remainingText) {
          parentNode.children.push({ text: remainingText });
        }
        break;
      }

      // Add text before tag
      if (tagStart > currentIndex) {
        const textContent = xml.substring(currentIndex, tagStart);
        if (textContent) {
          parentNode.children.push({ text: textContent });
        }
      }

      const tagEnd = xml.indexOf(">", tagStart);

      // Incomplete tag
      if (tagEnd === -1) {
        const remainingText = xml.substring(tagStart);
        if (remainingText) {
          parentNode.children.push({ text: remainingText });
        }
        break;
      }

      const tagContent = xml.substring(tagStart + 1, tagEnd);

      // Closing tag
      if (tagContent.startsWith("/")) {
        const closingTag = tagContent.substring(1);
        if (closingTag.toUpperCase() === parentNode.tag.toUpperCase()) {
          currentIndex = tagEnd + 1;
          break;
        } else {
          currentIndex = tagEnd + 1;
          continue;
        }
      }

      // Comments
      if (tagContent.startsWith("!--")) {
        const commentEnd = xml.indexOf("-->", tagStart);
        currentIndex = commentEnd !== -1 ? commentEnd + 3 : xml.length;
        continue;
      }

      // Parse tag name and attributes
      let tagName: string;
      let attrString: string;

      const firstSpace = tagContent.indexOf(" ");
      if (firstSpace === -1) {
        tagName = tagContent;
        attrString = "";
      } else {
        tagName = tagContent.substring(0, firstSpace);
        attrString = tagContent.substring(firstSpace + 1);
      }

      // Skip special tags
      if (tagName.startsWith("!") || tagName.startsWith("?")) {
        currentIndex = tagEnd + 1;
        continue;
      }

      // Self-closing tag
      const isSelfClosing = tagContent.endsWith("/");
      if (isSelfClosing) {
        tagName = tagName.replace(/\/$/, "");
      }

      // Parse attributes
      const attributes: Record<string, string> = {};
      let attrRemaining = attrString.trim();

      while (attrRemaining.length > 0) {
        const eqIndex = attrRemaining.indexOf("=");
        if (eqIndex === -1) break;

        const attrName = attrRemaining.substring(0, eqIndex).trim();
        attrRemaining = attrRemaining.substring(eqIndex + 1).trim();

        let attrValue = "";
        const quoteChar = attrRemaining.charAt(0);

        if (quoteChar === '"' || quoteChar === "'") {
          const endQuoteIndex = attrRemaining.indexOf(quoteChar, 1);

          if (endQuoteIndex !== -1) {
            attrValue = attrRemaining.substring(1, endQuoteIndex);
            attrRemaining = attrRemaining.substring(endQuoteIndex + 1).trim();
          } else {
            attrValue = attrRemaining.substring(1);
            attrRemaining = "";
          }
        } else {
          const nextSpaceIndex = attrRemaining.indexOf(" ");

          if (nextSpaceIndex !== -1) {
            attrValue = attrRemaining.substring(0, nextSpaceIndex);
            attrRemaining = attrRemaining.substring(nextSpaceIndex + 1).trim();
          } else {
            attrValue = attrRemaining;
            attrRemaining = "";
          }
        }

        attributes[attrName] = attrValue;
      }

      // Create new node
      const newNode: XMLNode = {
        tag: tagName,
        attributes,
        children: [],
        originalTagContent: xml.substring(tagStart, tagEnd + 1),
      };

      // Add to parent's children
      parentNode.children.push(newNode);

      currentIndex = tagEnd + 1;

      // If not self-closing, recursively parse
      if (!isSelfClosing) {
        this.parseElement(xml.substring(currentIndex), newNode);

        const closingTag = `</${tagName}>`;
        const closingTagIndex = xml.indexOf(closingTag, currentIndex);

        if (closingTagIndex !== -1) {
          currentIndex = closingTagIndex + closingTag.length;
        } else {
          break;
        }
      }
    }
  }

  /**
   * Check if text should have generating mark
   */
  private shouldHaveGeneratingMark(text: string): boolean {
    const trimmedText = text.trim();
    if (!trimmedText) return false;

    const textPos = this.latestContent.lastIndexOf(trimmedText);
    if (textPos === -1) return false;

    const textEnd = textPos + trimmedText.length;
    if (textEnd >= this.latestContent.length) return true;

    const afterText = this.latestContent.substring(textEnd).trim();
    return !afterText.startsWith("<");
  }

  /**
   * Create a heading element
   */
  private createHeading(
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
    node: XMLNode,
  ): HeadingElement {
    return {
      type: level,
      ...node.attributes,
      children: this.getTextDescendants(node),
    } as HeadingElement;
  }

  /**
   * Create a paragraph element
   */
  private createParagraph(node: XMLNode): ParagraphElement {
    return {
      type: "p",
      ...node.attributes,
      children: this.getTextDescendants(node),
    } as ParagraphElement;
  }

  /**
   * Create an image element
   */
  private createImage(node: XMLNode): ImageElement | null {
    if (!node.originalTagContent) {
      return null;
    }

    const url = node.attributes.url ?? node.attributes.src ?? "";

    const queryStart = node.originalTagContent.indexOf("query=");

    if (queryStart === -1) {
      return null;
    }

    const afterQuery = node.originalTagContent.substring(queryStart + 6);
    if (afterQuery.length === 0) {
      return null;
    }

    const quoteChar = afterQuery[0];
    if (quoteChar !== '"' && quoteChar !== "'") {
      return null;
    }

    const closingQuoteIdx = afterQuery.indexOf(quoteChar, 1);

    if (closingQuoteIdx === -1) {
      return null;
    }

    const query = afterQuery.substring(1, closingQuoteIdx);

    if (!query || query.trim().length < 3) {
      return null;
    }

    return {
      type: "img",
      ...node.attributes,
      url: url,
      query: query,
      children: [{ text: "" } as TText],
    } as ImageElement;
  }

  /**
   * Create a columns layout element
   */
  private createColumns(node: XMLNode): TColumnGroupElement {
    const columnItems: TColumnElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const columnItem: TColumnElement = {
          type: ColumnItemPlugin.key,
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
          width: "M",
        };
        columnItems.push(columnItem);
      }
    }

    return {
      type: ColumnPlugin.key,
      ...node.attributes,
      children: columnItems,
    } as TColumnGroupElement;
  }

  /**
   * Process a DIV node
   */
  private processDiv(node: XMLNode): PlateNode | null {
    const children = this.processNodes(node.children);

    if (children.length === 0) {
      const textContent = this.getTextContent(node);
      return {
        type: "p",
        ...node.attributes,
        children: [
          {
            text: textContent,
            ...(this.shouldHaveGeneratingMark(textContent)
              ? { generating: true }
              : {}),
          } as TText,
        ],
      } as ParagraphElement;
    } else if (children.length === 1) {
      return children[0] ?? null;
    } else {
      return {
        type: "p",
        ...node.attributes,
        children: children as Descendant[],
      } as ParagraphElement;
    }
  }

  /**
   * Create a bullets layout element
   */
  private createBulletGroup(node: XMLNode): TBulletGroupElement {
    const bulletItems: TBulletItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const bulletItem: TBulletItemElement = {
          type: "bullet",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        };
        bulletItems.push(bulletItem);
      }
    }

    return {
      type: "bullets",
      ...node.attributes,
      children: bulletItems,
    } as TBulletGroupElement;
  }

  /**
   * Create an icons layout element
   */
  private createIconList(node: XMLNode): TIconListElement {
    const iconItems: TIconListItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        let icon = this.extractIconValue(child);
        const children: Descendant[] = [];

        for (const iconChild of child.children) {
          if (!isElementNode(iconChild)) continue;

          if (iconChild.tag.toUpperCase() === "ICON") {
            icon ||= this.extractIconValue(iconChild);
            continue;
          }

          const processedChild = this.processNode(iconChild);
          if (processedChild) {
            children.push(processedChild as Descendant);
          }
        }

        const iconItem: TIconListItemElement = {
          type: "icon-item",
          ...child.attributes,
          ...(icon ? { icon } : {}),
          children,
        };
        iconItems.push(iconItem);
      }
    }

    return {
      type: "icons",
      ...node.attributes,
      children: iconItems,
    } as TIconListElement;
  }

  private extractIconValue(node: XMLNode): string {
    const rawValue =
      node.attributes.icon ?? node.attributes.name ?? node.attributes.query ?? "";

    if (!rawValue) return "";

    let sanitizedValue = rawValue;

    if (
      sanitizedValue.includes("<") ||
      sanitizedValue.includes(">") ||
      sanitizedValue.includes("</") ||
      sanitizedValue.includes("SECTION")
    ) {
      const tagIndex = Math.min(
        sanitizedValue.indexOf("<") !== -1
          ? sanitizedValue.indexOf("<")
          : Infinity,
        sanitizedValue.indexOf(">") !== -1
          ? sanitizedValue.indexOf(">")
          : Infinity,
        sanitizedValue.indexOf("</") !== -1
          ? sanitizedValue.indexOf("</")
          : Infinity,
        sanitizedValue.indexOf("SECTION") !== -1
          ? sanitizedValue.indexOf("SECTION")
          : Infinity,
      );

      sanitizedValue = sanitizedValue.substring(0, tagIndex).trim();
    }

    return sanitizedValue.trim().length >= 2 ? sanitizedValue.trim() : "";
  }

  /**
   * Create a cycle layout element
   */
  private createCycle(node: XMLNode): TCycleGroupElement {
    const cycleItems: TCycleItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const cycleItem: TCycleItemElement = {
          type: "cycle-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        };
        cycleItems.push(cycleItem);
      }
    }

    return {
      type: "cycle",
      ...node.attributes,
      children: cycleItems,
    } as TCycleGroupElement;
  }

  /**
   * Create a staircase layout element
   */
  private createStaircase(node: XMLNode): TStairGroupElement {
    const stairItems: TStairItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const stairItem: TStairItemElement = {
          type: "stair-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        };
        stairItems.push(stairItem);
      }
    }

    return {
      type: "staircase",
      ...node.attributes,
      children: stairItems,
    } as TStairGroupElement;
  }

  /**
   * Create an arrows layout element
   */
  private createArrowList(node: XMLNode): TArrowListElement {
    const arrowItems: TArrowListItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const itemChildren: Descendant[] = [];

        for (const divChild of child.children) {
          if (isTextNode(divChild)) {
            if (divChild.text.trim()) {
              itemChildren.push({
                text: divChild.text,
                ...(this.shouldHaveGeneratingMark(divChild.text)
                  ? { generating: true }
                  : {}),
              } as TText);
            }
          } else if (isElementNode(divChild)) {
            const processedChild = this.processNode(divChild);
            if (processedChild) {
              itemChildren.push(processedChild as Descendant);
            }
          }
        }

        if (itemChildren.length > 0) {
          arrowItems.push({
            type: "arrow-item",
            ...child.attributes,
            children: itemChildren,
          } as TArrowListItemElement);
        }
      }
    }

    return {
      type: "arrows",
      ...node.attributes,
      children:
        arrowItems.length > 0
          ? arrowItems
          : ([{ text: "" } as TText] as Descendant[]),
    } as TArrowListElement;
  }

  /**
   * Create a pyramid layout element
   */
  private createPyramid(node: XMLNode): TPyramidGroupElement {
    const pyramidItems: TPyramidItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const pyramidItem: TPyramidItemElement = {
          type: "pyramid-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        };
        pyramidItems.push(pyramidItem);
      }
    }

    return {
      type: "pyramid",
      ...node.attributes,
      children: pyramidItems,
    } as TPyramidGroupElement;
  }

  /**
   * Create Boxes layout
   */
  private createBoxes(node: XMLNode): TBoxGroupElement {
    const items: TBoxItemElement[] = [];
    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        items.push({
          type: "box-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TBoxItemElement);
      }
    }
    return {
      type: "boxes",
      ...node.attributes,
      children: items,
    } as TBoxGroupElement;
  }

  /**
   * Create Compare layout
   */
  private createCompare(node: XMLNode): TCompareGroupElement {
    const sides: TCompareSideElement[] = [];
    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        sides.push({
          type: "compare-side",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TCompareSideElement);
      }
    }
    return {
      type: "compare",
      ...node.attributes,
      children: sides,
    } as TCompareGroupElement;
  }

  /**
   * Create Before/After layout
   */
  private createBeforeAfter(node: XMLNode): TBeforeAfterGroupElement {
    const sides: TBeforeAfterSideElement[] = [];
    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        sides.push({
          type: "before-after-side",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TBeforeAfterSideElement);
      }
    }
    return {
      type: "before-after",
      ...node.attributes,
      children: sides,
    } as TBeforeAfterGroupElement;
  }

  /**
   * Create Pros/Cons layout
   */
  private createProsCons(node: XMLNode): TProsConsGroupElement {
    const children: (TProsItemElement | TConsItemElement)[] = [];
    for (const child of node.children) {
      if (!isElementNode(child)) continue;

      if (child.tag.toUpperCase() === "PROS") {
        children.push({
          type: "pros-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TProsItemElement);
      } else if (child.tag.toUpperCase() === "CONS") {
        children.push({
          type: "cons-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TConsItemElement);
      } else if (child.tag.toUpperCase() === "DIV") {
        const isPros = children.length % 2 === 0;
        children.push({
          type: isPros ? "pros-item" : "cons-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as unknown as TProsItemElement);
      }
    }
    return {
      type: "pros-cons",
      ...node.attributes,
      children,
    } as TProsConsGroupElement;
  }

  /**
   * Create Vertical Arrow layout
   */
  private createArrowVertical(node: XMLNode): TSequenceArrowGroupElement {
    const items: TSequenceArrowItemElement[] = [];
    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        items.push({
          type: "arrow-vertical-item",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TSequenceArrowItemElement);
      }
    }
    return {
      type: "arrow-vertical",
      ...node.attributes,
      children: items,
    } as TSequenceArrowGroupElement;
  }

  /**
   * Create Stats layout for displaying metrics/KPIs
   */
  private createStats(node: XMLNode): TStatsGroupElement {
    const items: TStatsItemElement[] = [];
    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        items.push({
          type: "stats-item",
          stat: child.attributes.stat || "0",
          ...child.attributes,
          children: this.processNodes(child.children) as Descendant[],
        } as TStatsItemElement);
      }
    }
    return {
      type: "stats",
      statsType:
        (node.attributes.statstype as TStatsGroupElement["statsType"]) ||
        "plain",
      ...node.attributes,
      children: items,
    } as TStatsGroupElement;
  }

  /**
   * Create a simple Table layout
   */
  private createPlainTable(node: XMLNode): TTableElement {
    const rows: TTableRowElement[] = [];

    const parseRow = (rowNode: XMLNode): void => {
      if (!rowNode) return;
      const cells: TTableCellElement[] = [];

      for (const cellNode of rowNode.children) {
        if (!isElementNode(cellNode)) continue;

        const tag = cellNode.tag.toUpperCase();
        if (tag === "TD" || tag === "TH") {
          const isCellHeader = tag === "TH";

          const cellChildren = this.processNodes(
            cellNode.children,
          ) as Descendant[];

          const colSpanStr =
            cellNode.attributes.colspan || cellNode.attributes.colSpan;
          const rowSpanStr =
            cellNode.attributes.rowspan || cellNode.attributes.rowSpan;

          const colSpanVal = colSpanStr ? parseInt(colSpanStr, 10) : undefined;
          const rowSpanVal = rowSpanStr ? parseInt(rowSpanStr, 10) : undefined;

          const background =
            cellNode.attributes.background || cellNode.attributes.bg;

          const extraProps: {
            colSpan?: number;
            rowSpan?: number;
            background?: string;
          } = {};
          if (colSpanVal && colSpanVal > 1) extraProps.colSpan = colSpanVal;
          if (rowSpanVal && rowSpanVal > 1) extraProps.rowSpan = rowSpanVal;
          if (background) extraProps.background = background;

          const cell = {
            type: isCellHeader ? "th" : "td",
            ...cellNode.attributes,
            ...extraProps,
            children:
              cellChildren.length > 0
                ? cellChildren
                : ([
                    {
                      type: "p",
                      children: [
                        {
                          text: this.getTextContent(cellNode).trim() || "",
                        } as TText,
                      ],
                    },
                  ] as unknown as Descendant[]),
          } as unknown as TTableCellElement;

          cells.push(cell);
        }
      }

      rows.push({
        type: "tr",
        ...rowNode.attributes,
        children: cells,
      } as TTableRowElement);
    };

    for (const child of node.children) {
      if (!isElementNode(child)) continue;

      const tag = child.tag.toUpperCase();
      if (tag === "THEAD") {
        for (const row of child.children) {
          if (!isElementNode(row)) continue;
          const rowTag = row.tag.toUpperCase();
          if (rowTag === "TR" || rowTag === "ROW") parseRow(row);
        }
      }
    }

    const directRows: XMLNode[] = [];
    const bodyRows: XMLNode[] = [];
    for (const child of node.children) {
      if (!isElementNode(child)) continue;

      const tag = child.tag.toUpperCase();
      if (tag === "TBODY") {
        for (const row of child.children) {
          if (!isElementNode(row)) continue;
          const rowTag = row.tag.toUpperCase();
          if (rowTag === "TR" || rowTag === "ROW") bodyRows.push(row);
        }
      } else if (tag === "TR" || tag === "ROW") {
        directRows.push(child);
      }
    }

    const remainingRows: XMLNode[] = [...directRows, ...bodyRows];

    for (let i = 0; i < remainingRows.length; i++) {
      const row = remainingRows[i]!;
      parseRow(row);
    }

    return {
      type: "table",
      ...node.attributes,
      children: rows,
    } as TTableElement;
  }

  /**
   * Create a timeline layout element
   */
  private createTimeline(node: XMLNode): TTimelineGroupElement {
    const timelineItems: TTimelineItemElement[] = [];

    for (const child of node.children) {
      if (isElementNode(child) && child.tag.toUpperCase() === "DIV") {
        const itemChildren: Descendant[] = [];

        for (const divChild of child.children) {
          if (isTextNode(divChild)) {
            if (divChild.text.trim()) {
              itemChildren.push({
                text: divChild.text,
                ...(this.shouldHaveGeneratingMark(divChild.text)
                  ? { generating: true }
                  : {}),
              } as TText);
            }
          } else if (isElementNode(divChild)) {
            const processedChild = this.processNode(divChild);
            if (processedChild) {
              itemChildren.push(processedChild as Descendant);
            }
          }
        }

        if (itemChildren.length > 0) {
          timelineItems.push({
            type: "timeline-item",
            ...child.attributes,
            children: itemChildren,
          } as TTimelineItemElement);
        }
      }
    }

    return {
      type: "timeline",
      ...node.attributes,
      children:
        timelineItems.length > 0
          ? timelineItems
          : ([{ text: "" } as TText] as Descendant[]),
    } as TTimelineGroupElement;
  }

  /**
   * Create a chart element
   */
  private createChart(node: XMLNode): PlateNode {
    const chartType = (node.attributes.charttype || "bar").toLowerCase();

    const dataNodes = node.children.filter(
      (child) => isElementNode(child) && child.tag.toUpperCase() === "DATA",
    ) as XMLNode[];

    let parsedData: unknown[] | null = null;

    if (dataNodes.length > 0) {
      if (chartType === "scatter") {
        const points: Array<{ x: number; y: number }> = [];
        for (const d of dataNodes) {
          const xNode = d.children.find(
            (c) => isElementNode(c) && c.tag.toUpperCase() === "X",
          ) as XMLNode | undefined;
          const yNode = d.children.find(
            (c) => isElementNode(c) && c.tag.toUpperCase() === "Y",
          ) as XMLNode | undefined;
          const xAttr = d.attributes.x;
          const yAttr = d.attributes.y;
          const x = parseFloat(
            this.getTextContent(
              xNode || ({ children: [] } as unknown as XMLNode),
            ).trim() ||
              xAttr ||
              "0",
          );
          const y = parseFloat(
            this.getTextContent(
              yNode || ({ children: [] } as unknown as XMLNode),
            ).trim() ||
              yAttr ||
              "0",
          );
          points.push({
            x: Number.isNaN(x) ? 0 : x,
            y: Number.isNaN(y) ? 0 : y,
          });
        }
        parsedData = points;
      } else {
        const rows: Array<{ label: string; value: number }> = [];
        for (const d of dataNodes) {
          const labelNode = d.children.find(
            (c) => isElementNode(c) && c.tag.toUpperCase() === "LABEL",
          ) as XMLNode | undefined;
          const valueNode = d.children.find(
            (c) => isElementNode(c) && c.tag.toUpperCase() === "VALUE",
          ) as XMLNode | undefined;
          const labelAttr = d.attributes.label ?? d.attributes.name ?? "";
          const valueAttr = d.attributes.value ?? "";
          const label = (
            this.getTextContent(
              labelNode || ({ children: [] } as unknown as XMLNode),
            ).trim() ||
            labelAttr ||
            ""
          ).toString();
          const valueParsed = parseFloat(
            (
              this.getTextContent(
                valueNode || ({ children: [] } as unknown as XMLNode),
              ).trim() ||
              valueAttr ||
              "0"
            ).toString(),
          );
          rows.push({
            label,
            value: Number.isNaN(valueParsed) ? 0 : valueParsed,
          });
        }
        parsedData = rows;
      }
    }

    if (parsedData === null) parsedData = [];

    const typeMap: Record<string, string> = {
      pie: PIE_CHART_ELEMENT,
      bar: BAR_CHART_ELEMENT,
      area: AREA_CHART_ELEMENT,
      radar: RADAR_CHART_ELEMENT,
      scatter: SCATTER_CHART_ELEMENT,
      line: LINE_CHART_ELEMENT,
      candlestick: CANDLESTICK_CHART_ELEMENT,
      ohlc: OHLC_CHART_ELEMENT,
      "box-plot": BOX_PLOT_CHART_ELEMENT,
      boxplot: BOX_PLOT_CHART_ELEMENT,
    };

    const elementType = typeMap[chartType] || BAR_CHART_ELEMENT;

    return {
      type: elementType,
      ...node.attributes,
      data: parsedData,
      children: [{ text: "" } as TText],
    } as PlateNode;
  }

  /**
   * Create a non-functional themed Button element
   */
  private createButton(node: XMLNode): PlateNode {
    const variantAttr = (node.attributes.variant || "").toLowerCase();
    const sizeAttr = (node.attributes.size || "").toLowerCase();

    const variant: "filled" | "outline" | "ghost" | undefined =
      variantAttr === "filled" ||
      variantAttr === "outline" ||
      variantAttr === "ghost"
        ? (variantAttr as "filled" | "outline" | "ghost")
        : undefined;

    const size: "sm" | "md" | "lg" | undefined =
      sizeAttr === "sm" || sizeAttr === "md" || sizeAttr === "lg"
        ? (sizeAttr as "sm" | "md" | "lg")
        : undefined;

    const children = this.processNodes(node.children) as Descendant[];
    const fallback = this.getTextContent(node).trim() || "";
    const finalChildren =
      children.length > 0
        ? children
        : ([{ text: fallback }] as unknown as Descendant[]);

    return {
      type: "button",
      ...node.attributes,
      ...(variant ? { variant } : {}),
      ...(size ? { size } : {}),
      children: finalChildren,
    } as unknown as PlateNode;
  }

  /**
   * Extract text descendants from a node, processing inline formatting
   * This is the KEY method that maintains order of text and elements
   */
  private getTextDescendants(node: XMLNode): Descendant[] {
    const descendants: Descendant[] = [];

    for (const child of node.children) {
      if (isTextNode(child)) {
        // Direct text node
        if (child.text) {
          descendants.push({
            text: child.text,
            ...(this.shouldHaveGeneratingMark(child.text)
              ? { generating: true }
              : {}),
          } as TText);
        }
      } else if (isElementNode(child)) {
        const childTag = child.tag.toUpperCase();

        // Handle inline formatting elements
        if (childTag === "B" || childTag === "STRONG") {
          const content = this.getTextContent(child);
          descendants.push({
            text: content,
            bold: true,
            ...(this.shouldHaveGeneratingMark(content)
              ? { generating: true }
              : {}),
          } as Descendant);
        } else if (childTag === "I" || childTag === "EM") {
          const content = this.getTextContent(child);
          descendants.push({
            text: content,
            italic: true,
            ...(this.shouldHaveGeneratingMark(content)
              ? { generating: true }
              : {}),
          } as Descendant);
        } else if (childTag === "U") {
          const content = this.getTextContent(child);
          descendants.push({
            text: content,
            underline: true,
            ...(this.shouldHaveGeneratingMark(content)
              ? { generating: true }
              : {}),
          } as Descendant);
        } else if (childTag === "S" || childTag === "STRIKE") {
          const content = this.getTextContent(child);
          descendants.push({
            text: content,
            strikethrough: true,
            ...(this.shouldHaveGeneratingMark(content)
              ? { generating: true }
              : {}),
          } as Descendant);
        } else {
          // For other elements, recursively process them
          const processedChild = this.processNode(child);
          if (processedChild) {
            descendants.push(processedChild as Descendant);
          }
        }
      }
    }

    // Return empty text node if no descendants
    return descendants.length > 0 ? descendants : [{ text: "" } as TText];
  }

  /**
   * Get the complete text content of a node (flattened)
   */
  private getTextContent(node: XMLNode): string {
    let text = "";

    for (const child of node.children) {
      if (isTextNode(child)) {
        text += child.text;
      } else if (isElementNode(child)) {
        text += this.getTextContent(child);
      }
    }

    return text;
  }

  /**
   * Process a list of XMLNodes into Plate elements
   */
  private processNodes(nodes: Array<XMLNode | XMLTextNode>): PlateNode[] {
    const plateNodes: PlateNode[] = [];

    for (let i = 0; i < nodes.length; ) {
      const node = nodes[i];
      if (!node) {
        i += 1;
        continue;
      }

      // Skip text nodes at this level (they're handled by getTextDescendants)
      if (isTextNode(node)) {
        i += 1;
        continue;
      }

      const tag = node.tag.toUpperCase();

      // Group consecutive <LI> siblings
      if (tag === "LI") {
        const liNodes: XMLNode[] = [];
        let j = i;
        while (j < nodes.length) {
          const candidate = nodes[j];
          if (!candidate || !isElementNode(candidate)) break;
          if (candidate.tag.toUpperCase() !== "LI") break;
          liNodes.push(candidate);
          j += 1;
        }
        const listItems = this.createListItemsFromLiNodes(liNodes);
        for (const item of listItems) plateNodes.push(item);
        i = j;
        continue;
      }

      // Default: process normally
      const processedNode = this.processNode(node);
      if (processedNode) {
        plateNodes.push(processedNode);
      }
      i += 1;
    }

    return plateNodes;
  }

  /**
   * Process a single XMLNode into a Plate element
   */
  private processNode(node: XMLNode): PlateNode | null {
    const tag = node.tag.toUpperCase();

    switch (tag) {
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "H5":
      case "H6":
        return this.createHeading(
          tag.toLowerCase() as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
          node,
        );
      case "P":
        return this.createParagraph(node);
      case "IMG":
        return this.createImage(node);
      case "COLUMNS":
        return this.createColumns(node);
      case "DIV":
        return this.processDiv(node);
      case "BULLETS":
        return this.createBulletGroup(node);
      case "ICONS":
        return this.createIconList(node);
      case "CYCLE":
        return this.createCycle(node);
      case "STAIRCASE":
        return this.createStaircase(node);
      case "CHART":
        return this.createChart(node);
      case "ARROWS":
        return this.createArrowList(node);
      case "LI":
        return this.createListItemsFromLiNodes([node])[0] ?? null;
      case "PYRAMID":
        return this.createPyramid(node);
      case "TIMELINE":
        return this.createTimeline(node);
      case "ICON":
        return null;
      case "BUTTON":
        return this.createButton(node);
      default:
        if (node.children.length > 0) {
          const children = this.processNodes(node.children);
          if (children.length > 0) {
            return {
              type: "p",
              ...node.attributes,
              children: children as Descendant[],
            } as ParagraphElement;
          }
        }
        return null;
    }
  }

  /**
   * Create a quote element
   */
  private createQuote(node: XMLNode): TQuoteElement {
    const variant =
      (node.attributes.variant as "large" | "sidequote-icon" | "sidequote") ??
      "large";
    const author = node.attributes.author ?? "";

    const text = this.getTextContent(node).trim();
    const children: Descendant[] = text
      ? [
          {
            text,
            ...(this.shouldHaveGeneratingMark(text)
              ? { generating: true }
              : {}),
          } as TText,
        ]
      : [{ text: "" } as TText];

    return {
      type: QUOTE_ELEMENT,
      id: nanoid(),
      variant,
      author,
      children,
    } as TQuoteElement;
  }

  /**
   * Convert <LI> nodes into Plate list paragraph elements
   */
  private createListItemsFromLiNodes(
    liNodes: XMLNode[],
    isOrdered = false,
  ): ParagraphElement[] {
    const items: ParagraphElement[] = [];

    for (const li of liNodes) {
      let itemChildren = this.processNodes(li.children) as Descendant[];
      const contentText = this.getTextContent(li).trim();

      if ((!itemChildren || itemChildren.length === 0) && contentText) {
        itemChildren = [
          {
            text: contentText,
            ...(this.shouldHaveGeneratingMark(contentText)
              ? { generating: true }
              : {}),
          } as TText,
        ] as unknown as Descendant[];
      }

      if (!itemChildren || itemChildren.length === 0) {
        itemChildren = [{ text: "" } as TText] as unknown as Descendant[];
      }

      items.push({
        type: "p",
        ...li.attributes,
        children: itemChildren,
        indent: 1,
        listStyleType: isOrdered ? "decimal" : "disc",
      } as unknown as ParagraphElement);
    }

    return items;
  }
}

// Example usage
export function parseSlideXml(xmlData: string): PlateSlide[] {
  const parser = new SlideParser();
  parser.parseChunk(xmlData);
  parser.finalize();
  return parser.getAllSlides();
}
