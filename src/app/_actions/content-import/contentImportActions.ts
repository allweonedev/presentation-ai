import { z } from "zod";

const urlSchema = z.string().url();

export async function extractContentFromUrl(url: string) {
  try {
    // Validate URL
    urlSchema.parse(url);

    // For now, return a placeholder response
    // TODO: Implement actual content extraction
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PresentationAI/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Basic HTML parsing to extract title and main content
    // This is a simplified implementation - in production you'd want more robust parsing
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch?.[1]?.trim() ?? 'Untitled Page';

    // Extract text content from body (very basic)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = '';
    if (bodyMatch?.[1]) {
      // Remove scripts and styles
      content = bodyMatch[1]!
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return {
      success: true,
      title,
      content: content.substring(0, 5000), // Limit content length
      url,
    };
  } catch (error) {
    console.error('URL extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract content',
    };
  }
}

export async function processImportedContent(content: string, title?: string) {
  // TODO: Use AI to structure and summarize the imported content
  // For now, just format it nicely
  const formattedContent = `
${title ? `## ${title}\n\n` : ''}${content}

---
*Content imported and ready for presentation generation*
  `.trim();

  return formattedContent;
}