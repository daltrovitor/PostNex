/**
 * PostFusion — Video Publishing Worker
 *
 * This worker processes scheduled posts from BullMQ queue
 * and publishes videos to TikTok, Instagram, and YouTube
 * via their official APIs.
 *
 * Run this separately: npx tsx workers/publisher.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Worker, Queue } from "bullmq";
import { createClient } from "@supabase/supabase-js";
import IORedis from "ioredis";

// Redis connection
const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

// Supabase service role client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Queue for scheduling
export const publishQueue = new Queue("publish-video", { connection: connection as any });

// ─── Platform Publishers ─────────────────────────────

async function publishToTikTok(
    accessToken: string,
    videoUrl: string,
    caption: string,
    hashtags: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // Step 1: Initialize upload
        const initRes = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/video/init/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    post_info: {
                        title: `${caption} ${hashtags.join(" ")}`,
                        privacy_level: "PUBLIC_TO_EVERYONE",
                        disable_duet: false,
                        disable_comment: false,
                        disable_stitch: false,
                    },
                    source_info: {
                        source: "PULL_FROM_URL",
                        video_url: videoUrl,
                    },
                }),
            }
        );

        const initData = await initRes.json();

        if (initData.data?.publish_id) {
            return { success: true, postId: initData.data.publish_id };
        }

        return { success: false, error: initData.error?.message || "Unknown error" };
    } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
    }
}

async function publishToInstagram(
    accessToken: string,
    videoUrl: string,
    caption: string,
    hashtags: string[],
    igUserId: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // Step 1: Create media container
        const containerRes = await fetch(
            `https://graph.facebook.com/v18.0/${igUserId}/media`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    media_type: "REELS",
                    video_url: videoUrl,
                    caption: `${caption}\n\n${hashtags.join(" ")}`,
                    access_token: accessToken,
                }),
            }
        );

        const containerData = await containerRes.json();
        const containerId = containerData.id;

        if (!containerId) {
            return { success: false, error: "Failed to create container" };
        }

        // Step 2: Wait for processing & publish
        await new Promise((resolve) => setTimeout(resolve, 30000));

        const publishRes = await fetch(
            `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    creation_id: containerId,
                    access_token: accessToken,
                }),
            }
        );

        const publishData = await publishRes.json();

        if (publishData.id) {
            return { success: true, postId: publishData.id };
        }

        return { success: false, error: publishData.error?.message || "Publish failed" };
    } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
    }
}

async function publishToYouTube(
    accessToken: string,
    videoUrl: string,
    caption: string,
    hashtags: string[]
): Promise<{ success: boolean; postId?: string; error?: string }> {
    try {
        // Download video first for YouTube upload
        const videoResponse = await fetch(videoUrl);
        const videoBuffer = await videoResponse.arrayBuffer();

        // Step 1: Create video metadata
        const metadataRes = await fetch(
            "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Upload-Content-Type": "video/*",
                    "X-Upload-Content-Length": videoBuffer.byteLength.toString(),
                },
                body: JSON.stringify({
                    snippet: {
                        title: caption.slice(0, 100),
                        description: `${caption}\n\n${hashtags.join(" ")}`,
                        tags: hashtags.map((h) => h.replace("#", "")),
                        categoryId: "22", // People & Blogs
                    },
                    status: {
                        privacyStatus: "public",
                        selfDeclaredMadeForKids: false,
                    },
                }),
            }
        );

        const uploadUrl = metadataRes.headers.get("location");

        if (!uploadUrl) {
            return { success: false, error: "Failed to get upload URL" };
        }

        // Step 2: Upload video
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "video/*",
            },
            body: videoBuffer,
        });

        const uploadData = await uploadRes.json();

        if (uploadData.id) {
            return { success: true, postId: uploadData.id };
        }

        return { success: false, error: uploadData.error?.message || "Upload failed" };
    } catch (error: unknown) {
        return { success: false, error: (error as Error).message };
    }
}

// ─── Worker Process ──────────────────────────────────

const worker = new Worker(
    "publish-video",
    async (job) => {
        const { scheduledPostId } = job.data;

        console.log(`[Worker] Processing post: ${scheduledPostId}`);

        // Update status to publishing
        await supabase
            .from("scheduled_posts")
            .update({ status: "publishing" })
            .eq("id", scheduledPostId);

        // Fetch post with related data
        const { data: post } = await supabase
            .from("scheduled_posts")
            .select(`
        *,
        videos (*),
        connected_accounts (*)
      `)
            .eq("id", scheduledPostId)
            .single();

        if (!post) {
            throw new Error(`Post not found: ${scheduledPostId}`);
        }

        const account = post.connected_accounts;
        const video = post.videos;

        let result: { success: boolean; postId?: string; error?: string };

        switch (post.platform) {
            case "tiktok":
                result = await publishToTikTok(
                    account.access_token,
                    video.video_url,
                    post.caption,
                    post.hashtags
                );
                break;

            case "instagram":
                result = await publishToInstagram(
                    account.access_token,
                    video.video_url,
                    post.caption,
                    post.hashtags,
                    account.platform_user_id
                );
                break;

            case "youtube":
                result = await publishToYouTube(
                    account.access_token,
                    video.video_url,
                    post.caption,
                    post.hashtags
                );
                break;

            default:
                result = { success: false, error: "Unknown platform" };
        }

        if (result.success) {
            await supabase
                .from("scheduled_posts")
                .update({
                    status: "published",
                    published_at: new Date().toISOString(),
                    platform_post_id: result.postId || null,
                    platform_response: result as unknown as Record<string, unknown>,
                })
                .eq("id", scheduledPostId);

            console.log(`[Worker] Published successfully: ${scheduledPostId}`);
        } else {
            await supabase
                .from("scheduled_posts")
                .update({
                    status: "failed",
                    error_message: result.error || "Unknown error",
                    platform_response: result as unknown as Record<string, unknown>,
                })
                .eq("id", scheduledPostId);

            console.error(`[Worker] Failed: ${scheduledPostId} - ${result.error}`);
        }
    },
    {
        connection: connection as any,
        concurrency: 5,
    }
);

worker.on("completed", (job) => {
    console.log(`[Worker] Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`[Worker] Job failed: ${job?.id}`, err);
});

// ─── Scheduler (Cron) ────────────────────────────────

async function checkScheduledPosts() {
    const now = new Date().toISOString();

    const { data: posts } = await supabase
        .from("scheduled_posts")
        .select("id")
        .eq("status", "pending")
        .lte("scheduled_at", now);

    if (posts && posts.length > 0) {
        console.log(`[Scheduler] Found ${posts.length} posts to publish`);

        for (const post of posts) {
            await publishQueue.add("publish", { scheduledPostId: post.id }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 60000, // 1 minute base delay
                },
            });
        }
    }
}

// Run scheduler every minute
setInterval(checkScheduledPosts, 60000);
checkScheduledPosts();

console.log("[PostFusion Worker] Running...");
console.log("[PostFusion Scheduler] Checking every 60 seconds...");
