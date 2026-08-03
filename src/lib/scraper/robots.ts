import robotsParser from "robots-parser";

const ROBOTS_FETCH_TIMEOUT_MS = 5000; 

// Checks whether the scraper is allowed to fetch a given URL per that domain's robot.txt
export async function isScrapingAllowed(
    targetUrl: string,
    userAgent = "TracklyBot"
): Promise<boolean> {
    const robotsUrl = new URL("/robots.txt", targetUrl).toString();

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), ROBOTS_FETCH_TIMEOUT_MS);

        const res = await fetch(robotsUrl, {
            signal: controller.signal,
            headers: { "User-Agent": userAgent },
        });

        clearTimeout(timeout);

        // No robots.txt -> no restriction
        if (res.status === 404) return true;
        // Unreachable 
        if (!res.ok) return true;

        const body = await res.text();
        const robots = robotsParser(robotsUrl, body);
        return robots.isAllowed(targetUrl, userAgent) ?? true;
    } catch {
        // Nextwork error / timeout fetching robots.txt -> treated as unrestricted access
        return true
    }
}