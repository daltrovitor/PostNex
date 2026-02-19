import { NextResponse } from "next/server";

// AI Hashtag Generation endpoint
// In production, replace with OpenAI or similar API call
export async function POST(request: Request) {
    try {
        const { caption, platform } = await request.json();

        if (!caption) {
            return NextResponse.json(
                { error: "Caption is required" },
                { status: 400 }
            );
        }

        // Analyze caption keywords and generate relevant hashtags
        const words = caption
            .toLowerCase()
            .replace(/[^a-záéíóúãõâêîôûç\s]/g, "")
            .split(/\s+/)
            .filter((w: string) => w.length > 3);

        const trendingHashtags: Record<string, string[]> = {
            tiktok: [
                "#fyp", "#foryou", "#foryoupage", "#viral", "#trending",
                "#tiktok", "#fy", "#parati", "#fypシ",
            ],
            instagram: [
                "#instagood", "#instagram", "#instadaily", "#reels",
                "#reelsinstagram", "#explorepage", "#trending",
            ],
            youtube: [
                "#shorts", "#youtube", "#youtuber", "#subscribe",
                "#viral", "#trending",
            ],
        };

        // Category-based hashtags
        const categoryMap: Record<string, string[]> = {
            marketing: ["#marketing", "#digitalmarketing", "#socialmedia", "#growth"],
            tech: ["#tech", "#technology", "#innovation", "#digital"],
            fitness: ["#fitness", "#workout", "#health", "#gym", "#motivation"],
            food: ["#food", "#recipe", "#cooking", "#foodie", "#delicious"],
            travel: ["#travel", "#wanderlust", "#explore", "#adventure"],
            business: ["#business", "#entrepreneur", "#startup", "#success"],
            education: ["#education", "#learning", "#knowledge", "#tips"],
            lifestyle: ["#lifestyle", "#life", "#inspiration", "#daily"],
            music: ["#music", "#song", "#musica", "#beat"],
            comedy: ["#comedy", "#funny", "#humor", "#laugh"],
        };

        const relevantHashtags: string[] = [];

        // Add trending hashtags for platform
        const platformTrending = trendingHashtags[platform || "tiktok"] || trendingHashtags.tiktok;
        relevantHashtags.push(
            ...platformTrending.sort(() => Math.random() - 0.5).slice(0, 3)
        );

        // Match categories
        for (const [category, tags] of Object.entries(categoryMap)) {
            if (words.some((w: string) => w.includes(category) || category.includes(w))) {
                relevantHashtags.push(
                    ...tags.sort(() => Math.random() - 0.5).slice(0, 2)
                );
            }
        }

        // Generate custom hashtags from caption words
        const customTags = words
            .filter((w: string) => w.length > 4)
            .slice(0, 3)
            .map((w: string) => `#${w}`);
        relevantHashtags.push(...customTags);

        // Deduplicate and limit
        const uniqueHashtags = [...new Set(relevantHashtags)].slice(0, 10);

        return NextResponse.json({
            hashtags: uniqueHashtags,
            suggestedText: uniqueHashtags.join(" "),
        });
    } catch (error: unknown) {
        console.error("Hashtag generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate hashtags" },
            { status: 500 }
        );
    }
}
