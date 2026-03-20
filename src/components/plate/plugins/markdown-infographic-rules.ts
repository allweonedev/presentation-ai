import { ANTV_INFOGRAPHIC } from "@/components/notebook/presentation/editor/lib";
import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import {
  defaultRules,
  type MdRules,
  type SerializeMdOptions,
} from "@platejs/markdown";
import { nanoid, type TText } from "platejs";

/** Minimal mdast Code node type for deserialization */
interface MdastCodeNode {
  type: "code";
  lang?: string | null;
  value: string;
  position?: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
    end: {
      line: number;
      column: number;
      offset: number;
    };
  };
}

function getCodeBlockLanguage(line: string): string | null {
  const trimmedLine = line.trimStart();

  if (!trimmedLine.startsWith("```")) {
    return null;
  }

  const [language] = trimmedLine.slice(3).trim().split(/\s+/, 1);
  const normalizedLanguage = language?.trim().toLowerCase();

  return normalizedLanguage ? normalizedLanguage : null;
}

function parseFencedCodeBlockValue(value: string): {
  content: string;
  language: string | null;
} {
  const trimmedValue = value.trimStart();

  if (!trimmedValue.startsWith("```")) {
    return { content: value, language: null };
  }

  const lineBreakIndex = trimmedValue.indexOf("\n");
  const openingLine =
    lineBreakIndex === -1
      ? trimmedValue
      : trimmedValue.slice(0, lineBreakIndex);
  const language = getCodeBlockLanguage(openingLine);

  if (!language) {
    return { content: value, language: null };
  }

  let content =
    lineBreakIndex === -1 ? "" : trimmedValue.slice(lineBreakIndex + 1);
  const closingFenceIndex = content.lastIndexOf("```");

  if (closingFenceIndex >= 0) {
    const trailingValue = content.slice(closingFenceIndex);

    if (trailingValue.trim() === "```") {
      content = content.slice(0, closingFenceIndex).trimEnd();
    }
  }

  return { content, language };
}

function buildInfographicElement(
  prompt: string,
  id: string,
): TAntvInfographicElement {
  return {
    type: ANTV_INFOGRAPHIC,
    id,
    generationPrompt: prompt.trim(),
    isLoading: true,
    syntax: "",
    children: [{ text: "" } as TText],
  };
}

function getInfographicId(mdastNode: MdastCodeNode): string {
  if (mdastNode.position) {
    return `i-${mdastNode.position.start.line}-${mdastNode.position.end.line}`;
  }

  return `i-${nanoid()}`;
}

function resolveCodeBlockNode(mdastNode: MdastCodeNode): MdastCodeNode {
  const { content, language } = parseFencedCodeBlockValue(mdastNode.value);

  if (!language) {
    return mdastNode;
  }

  return {
    ...mdastNode,
    lang: language,
    value: content,
  };
}

type CodeBlockDeserializer = NonNullable<
  NonNullable<MdRules["code_block"]>["deserialize"]
>;
type CodeBlockSerializer = NonNullable<
  NonNullable<MdRules["code_block"]>["serialize"]
>;

function deserializeInfographicCodeBlock(
  mdastNode: MdastCodeNode,
  deco: Readonly<Partial<Record<string, string | boolean>>>,
  options: Parameters<CodeBlockDeserializer>[2],
): TAntvInfographicElement | ReturnType<CodeBlockDeserializer> {
  const resolvedNode = resolveCodeBlockNode(mdastNode);
  const language = resolvedNode.lang?.trim().toLowerCase();

  if (language === "infographic") {
    return buildInfographicElement(
      resolvedNode.value,
      getInfographicId(mdastNode),
    );
  }

  const defaultCodeBlockDeserializer = defaultRules.code_block?.deserialize as
    | CodeBlockDeserializer
    | undefined;

  if (!defaultCodeBlockDeserializer) {
    throw new Error(
      "Default markdown code block deserializer is not available.",
    );
  }

  return defaultCodeBlockDeserializer(
    resolvedNode as Parameters<CodeBlockDeserializer>[0],
    deco,
    options,
  );
}

function serializeInfographicElement(
  slateNode: TAntvInfographicElement,
  _options: SerializeMdOptions,
): MdastCodeNode {
  const content =
    typeof slateNode.syntax === "string" && slateNode.syntax.trim().length > 0
      ? slateNode.syntax.trim()
      : (slateNode.generationPrompt?.trim() ?? "");

  return {
    type: "code",
    lang: "infographic",
    value: content.length > 0 ? content : "Generate an infographic",
  };
}

function serializeCodeBlock(
  slateNode: Parameters<CodeBlockSerializer>[0],
  options: Parameters<CodeBlockSerializer>[1],
): ReturnType<CodeBlockSerializer> {
  const defaultCodeBlockSerializer = defaultRules.code_block?.serialize as
    | CodeBlockSerializer
    | undefined;

  if (!defaultCodeBlockSerializer) {
    throw new Error("Default markdown code block serializer is not available.");
  }

  return defaultCodeBlockSerializer(slateNode, options);
}

export const infographicMarkdownRules: MdRules = {
  code_block: {
    deserialize:
      deserializeInfographicCodeBlock as unknown as CodeBlockDeserializer,
    serialize: serializeCodeBlock,
  },
  [ANTV_INFOGRAPHIC]: {
    serialize: serializeInfographicElement,
  },
};
