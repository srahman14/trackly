import * as cheerio from 'cheerio';

export interface ExtractionSection { 
    heading: string;
    text: string;
}

export interface ExtractionInput {
    fullText: string;
    sections: ExtractionSection[];
    links: { text: string, href: string }[];
}

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6, strong, b, dt';

// Converting raw HTML into a source-agnostic Extractioninput
export function htmlToExtractionInput(html: string, baseUrl: string): ExtractionInput {
    const $ = cheerio.load(html);

    const fullText = $('body').text().replace(/\s+/g, ' ').trim();

    const sections: ExtractionSection[] = [];
    $(HEADING_SELECTOR).each((_, el) => {
        const heading = $(el).text().trim();

        // Skip empty or non-matching headings 
        if (!heading || heading.length > 150) return;

        let text = '';
        let node = $(el).next();
        let guard = 0;
        
        while (node.length && !node.is(HEADING_SELECTOR) && guard < 10) {
            text += ' ' + node.text().trim(); 
            node = node.next();
            guard++;
        }

        text = text.replace(/\s+/g, ' ').trim();
        if (text) sections.push({ heading, text });
    });

    const links: { text: string; href: string }[] = [];
    $('a[href]').each((_, el) => {
        const text = $(el).text().trim();
        const href = $(el).attr('href');
        if (!text || !href) return;

        try {
            links.push({ text, href: new URL(href, baseUrl).toString() })
        } catch {
            // unrseolveable href (mailto, javascript or malformed)
        }
    });

    return { fullText, sections, links}
}