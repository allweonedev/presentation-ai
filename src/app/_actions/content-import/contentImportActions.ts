import { z } from "zod";

const urlSchema = z.string().url();

export async function extractContentFromUrl(url: string) {
  try {
    // Validate URL
    urlSchema.parse(url);

    console.log('🔗 Extracting content from:', url);

    // Add URL validation for common issues
    const urlObj = new URL(url);
    
    // Skip certain domains that typically block scraping
    const blockedDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com'];
    if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
      throw new Error(`Content extraction from ${urlObj.hostname} is not supported. Please try copying the content directly.`);
    }

    // Fetch with timeout and better headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal,
      redirect: 'follow', // Follow redirects
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL (status ${response.status}): ${response.statusText}`);
    }

    const html = await response.text();

    // Extract title from multiple possible sources
    const titleMatch = 
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
      'Untitled Page';
    
    const title = titleMatch.trim()
      .replace(/\s*\|\s*[^|]*$/, '') // Remove site name after pipe
      .replace(/\s*-\s*[^-]*$/, '')   // Remove site name after dash
      .substring(0, 100);

    // Extract description for better context
    const descMatch = 
      html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] ||
      '';

    // Try to find main content areas
    const contentPatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["'][^"']*post[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<body[^>]*>([\s\S]*?)<\/body>/i,
    ];

    let rawContent = '';
    for (const pattern of contentPatterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        rawContent = match[1];
        break;
      }
    }

    if (!rawContent) {
      throw new Error('Could not extract content from page');
    }

    // Clean HTML and extract text
    let content = rawContent
      // Remove script and style tags
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      // Remove navigation, footer, sidebar common patterns
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      // Convert headings to markdown-like format
      .replace(/<h([1-6])[^>]*>([^<]*)<\/h\1>/gi, '\n\n## $2\n\n')
      // Convert paragraphs
      .replace(/<p[^>]*>([^<]*)<\/p>/gi, '$1\n\n')
      // Convert list items
      .replace(/<li[^>]*>([^<]*)<\/li>/gi, '• $1\n')
      // Remove all remaining HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Clean up HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      // Clean up whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/  +/g, ' ')
      .trim();

    // Combine description with content if available
    const fullContent = descMatch 
      ? `${descMatch}\n\n${content}` 
      : content;

    // Limit content length (keep first 6000 chars for better context)
    const finalContent = fullContent.substring(0, 6000);

    if (finalContent.length < 100) {
      throw new Error('Extracted content is too short. The page may require JavaScript or be protected.');
    }

    console.log('✅ Successfully extracted content:', {
      title,
      contentLength: finalContent.length,
      hasDescription: !!descMatch,
    });

    return {
      success: true,
      title,
      content: finalContent,
      url,
    };
  } catch (error) {
    console.error('❌ URL extraction error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to extract content';

    // Provide helpful error messages
    let userMessage = errorMessage;
    if (errorMessage.includes('abort')) {
      userMessage = 'Request timed out. The page took too long to load.';
    } else if (errorMessage.includes('status 403') || errorMessage.includes('status 401')) {
      userMessage = 'Access denied. The website blocks automated access.';
    } else if (errorMessage.includes('status 404')) {
      userMessage = 'Page not found. Please check the URL.';
    } else if (errorMessage.includes('too short')) {
      userMessage = 'Could not extract meaningful content. Try copying the text directly.';
    }

    return {
      success: false,
      error: userMessage,
    };
  }
}

export async function processImportedContent(content: string, title?: string) {
  // Clean and structure the imported content
  let processedContent = content
    .trim()
    // Remove excessive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Clean up bullet points
    .replace(/^[•\-\*]\s+/gm, '• ')
    // Ensure proper spacing after headings
    .replace(/##\s+([^\n]+)\n(?!\n)/g, '## $1\n\n');

  // If content is very long, add a note
  const contentLength = processedContent.length;
  let lengthNote = '';
  if (contentLength > 3000) {
    lengthNote = '\n\n*Note: This is a long article. The AI will extract key points for your presentation.*';
  }

  // Format the final output
  const formattedContent = `
**Imported Content${title ? `: ${title}` : ''}**

${processedContent}${lengthNote}

---
*Use this content as the basis for your presentation. The AI will structure it into slides.*
  `.trim();

  return formattedContent;
}
