export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string;
                };
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    stripe_customer_id: string;
                    stripe_subscription_id: string;
                    plan: "starter" | "pro" | "scale";
                    status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
                    current_period_start: string;
                    current_period_end: string;
                    cancel_at_period_end: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    stripe_customer_id: string;
                    stripe_subscription_id: string;
                    plan: "starter" | "pro" | "scale";
                    status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
                    current_period_start: string;
                    current_period_end: string;
                    cancel_at_period_end?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    plan?: "starter" | "pro" | "scale";
                    status?: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
                    current_period_start?: string;
                    current_period_end?: string;
                    cancel_at_period_end?: boolean;
                    updated_at?: string;
                };
            };
            connected_accounts: {
                Row: {
                    id: string;
                    user_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    platform_user_id: string;
                    platform_username: string;
                    access_token: string;
                    refresh_token: string | null;
                    token_expires_at: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    platform_user_id: string;
                    platform_username: string;
                    access_token: string;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    access_token?: string;
                    refresh_token?: string | null;
                    token_expires_at?: string | null;
                    avatar_url?: string | null;
                    updated_at?: string;
                };
            };
            videos: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    description: string | null;
                    hashtags: string[];
                    video_url: string;
                    thumbnail_url: string | null;
                    file_size: number;
                    duration: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    description?: string | null;
                    hashtags?: string[];
                    video_url: string;
                    thumbnail_url?: string | null;
                    file_size: number;
                    duration?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    title?: string;
                    description?: string | null;
                    hashtags?: string[];
                    thumbnail_url?: string | null;
                    updated_at?: string;
                };
            };
            scheduled_posts: {
                Row: {
                    id: string;
                    user_id: string;
                    video_id: string;
                    connected_account_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    caption: string;
                    hashtags: string[];
                    scheduled_at: string;
                    published_at: string | null;
                    status: "pending" | "publishing" | "published" | "failed";
                    platform_post_id: string | null;
                    platform_response: Json | null;
                    error_message: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    video_id: string;
                    connected_account_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    caption: string;
                    hashtags?: string[];
                    scheduled_at: string;
                    published_at?: string | null;
                    status?: "pending" | "publishing" | "published" | "failed";
                    platform_post_id?: string | null;
                    platform_response?: Json | null;
                    error_message?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    status?: "pending" | "publishing" | "published" | "failed";
                    published_at?: string | null;
                    platform_post_id?: string | null;
                    platform_response?: Json | null;
                    error_message?: string | null;
                    updated_at?: string;
                };
            };
            analytics: {
                Row: {
                    id: string;
                    user_id: string;
                    scheduled_post_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    views: number;
                    likes: number;
                    comments: number;
                    shares: number;
                    engagement_rate: number;
                    fetched_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    scheduled_post_id: string;
                    platform: "tiktok" | "instagram" | "youtube";
                    views?: number;
                    likes?: number;
                    comments?: number;
                    shares?: number;
                    engagement_rate?: number;
                    fetched_at?: string;
                    created_at?: string;
                };
                Update: {
                    views?: number;
                    likes?: number;
                    comments?: number;
                    shares?: number;
                    engagement_rate?: number;
                    fetched_at?: string;
                };
            };
        };
    };
}
