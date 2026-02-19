"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Upload,
    Hash,
    Calendar,
    Clock,
    Globe,
    Sparkles,
    Video,
    X,
    Check,
    Loader2,
    Brain,
    Wand2,
} from "lucide-react";

interface ConnectedAccount {
    id: string;
    platform: string;
    platform_username: string;
    avatar_url: string | null;
}

export default function CreatePostPage() {
    const [caption, setCaption] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [generatingHashtags, setGeneratingHashtags] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("connected_accounts")
                .select("id, platform, platform_username, avatar_url")
                .eq("user_id", user.id);

            setAccounts(data || []);
        };
        fetchAccounts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const togglePlatform = (platform: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform)
                ? prev.filter((p) => p !== platform)
                : [...prev, platform]
        );
    };

    const toggleAccount = (accountId: string) => {
        setSelectedAccounts((prev) =>
            prev.includes(accountId)
                ? prev.filter((a) => a !== accountId)
                : [...prev, accountId]
        );
    };

    const generateHashtags = async () => {
        setGeneratingHashtags(true);
        // Simulated AI hashtag generation
        await new Promise((r) => setTimeout(r, 1500));
        const sampleHashtags = [
            "#contentcreator",
            "#socialmedia",
            "#viral",
            "#trending",
            "#reels",
            "#shorts",
            "#fyp",
            "#marketing",
            "#growth",
            "#automation",
        ];
        const selected = sampleHashtags
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .join(" ");
        setHashtags(selected);
        setGeneratingHashtags(false);
    };

    const getSuggestedTime = () => {
        // AI-suggested optimal time (mock)
        const hours = [9, 12, 17, 19, 21];
        const hour = hours[Math.floor(Math.random() * hours.length)];
        setScheduledTime(`${hour.toString().padStart(2, "0")}:00`);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setScheduledDate(tomorrow.toISOString().split("T")[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || selectedAccounts.length === 0) return;

        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Upload video
            const fileExt = videoFile.name.split(".").pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("videos")
                .upload(fileName, videoFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("videos")
                .getPublicUrl(fileName);

            // Create video record
            const { data: video, error: videoError } = await supabase
                .from("videos")
                .insert({
                    user_id: user.id,
                    title: caption.slice(0, 100) || "Untitled",
                    description: caption,
                    hashtags: hashtags.split(" ").filter(Boolean),
                    video_url: publicUrl,
                    file_size: videoFile.size,
                })
                .select()
                .single();

            if (videoError) throw videoError;

            // Create scheduled posts for each selected account
            const scheduledAt = new Date(
                `${scheduledDate}T${scheduledTime}:00`
            ).toISOString();

            const postsToInsert = selectedAccounts.map((accountId) => {
                const account = accounts.find((a) => a.id === accountId);
                return {
                    user_id: user.id,
                    video_id: video.id,
                    connected_account_id: accountId,
                    platform: account?.platform || "tiktok",
                    caption,
                    hashtags: hashtags.split(" ").filter(Boolean),
                    scheduled_at: scheduledAt,
                    status: "pending" as const,
                };
            });

            const { error: postsError } = await supabase
                .from("scheduled_posts")
                .insert(postsToInsert);

            if (postsError) throw postsError;

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                // Reset form
                setCaption("");
                setHashtags("");
                setScheduledDate("");
                setScheduledTime("");
                setSelectedPlatforms([]);
                setSelectedAccounts([]);
                setVideoFile(null);
                setVideoPreview(null);
            }, 3000);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    const platforms = [
        { key: "tiktok", label: "TikTok", color: "bg-gray-900 text-white" },
        { key: "instagram", label: "Instagram", color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
        { key: "youtube", label: "YouTube", color: "bg-red-500 text-white" },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Criar Post</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Publique em todas as plataformas com 1 clique.
                </p>
            </div>

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3"
                >
                    <Check className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-emerald-800 font-medium">
                        Post agendado com sucesso! Será publicado no horário escolhido.
                    </p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Video Upload */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-border/50 p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Vídeo
                    </h3>

                    {videoPreview ? (
                        <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video max-w-sm">
                            <video
                                src={videoPreview}
                                className="w-full h-full object-contain"
                                controls
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoFile(null);
                                    setVideoPreview(null);
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/30 hover:bg-indigo-50/30 transition-all"
                        >
                            <Upload className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                            <p className="text-sm font-medium">
                                Clique para selecionar ou arraste o vídeo
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                MP4, MOV, AVI • Máx 500MB
                            </p>
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </motion.div>

                {/* Caption */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-border/50 p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Legenda
                    </h3>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Escreva a legenda do seu post..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                        {caption.length}/2200 caracteres
                    </div>
                </motion.div>

                {/* Hashtags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-border/50 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Hash className="w-5 h-5 text-primary" />
                            Hashtags
                        </h3>
                        <button
                            type="button"
                            disabled={generatingHashtags}
                            onClick={generateHashtags}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium hover:bg-violet-100 transition-colors disabled:opacity-50"
                        >
                            {generatingHashtags ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Brain className="w-3.5 h-3.5" />
                            )}
                            Gerar com IA
                        </button>
                    </div>
                    <input
                        type="text"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="#hashtag1 #hashtag2 #hashtag3"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </motion.div>

                {/* Platforms & Accounts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-border/50 p-6"
                >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Plataformas
                    </h3>

                    <div className="flex gap-3 mb-6">
                        {platforms.map((platform) => (
                            <button
                                key={platform.key}
                                type="button"
                                onClick={() => togglePlatform(platform.key)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedPlatforms.includes(platform.key)
                                        ? `${platform.color} shadow-md`
                                        : "bg-gray-50 text-muted-foreground border border-border hover:bg-gray-100"
                                    }`}
                            >
                                {platform.label}
                            </button>
                        ))}
                    </div>

                    {/* Connected accounts for selected platforms */}
                    {accounts.filter((a) => selectedPlatforms.includes(a.platform)).length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Contas conectadas
                            </p>
                            {accounts
                                .filter((a) => selectedPlatforms.includes(a.platform))
                                .map((account) => (
                                    <label
                                        key={account.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedAccounts.includes(account.id)
                                                ? "border-primary/30 bg-indigo-50/50"
                                                : "border-border/50 hover:bg-gray-50"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedAccounts.includes(account.id)}
                                            onChange={() => toggleAccount(account.id)}
                                            className="sr-only"
                                        />
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                                            {account.platform_username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">
                                                @{account.platform_username}
                                            </div>
                                            <div className="text-xs text-muted-foreground capitalize">
                                                {account.platform}
                                            </div>
                                        </div>
                                        {selectedAccounts.includes(account.id) && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </label>
                                ))}
                        </div>
                    )}

                    {accounts.length === 0 && selectedPlatforms.length > 0 && (
                        <div className="text-center py-6">
                            <p className="text-sm text-muted-foreground">
                                Nenhuma conta conectada.{" "}
                                <a href="/dashboard/accounts" className="text-primary font-medium hover:underline">
                                    Conectar contas
                                </a>
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Scheduling */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-border/50 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Agendamento
                        </h3>
                        <button
                            type="button"
                            onClick={getSuggestedTime}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors"
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            Sugerir horário ideal
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                                Data
                            </label>
                            <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground font-medium mb-1.5">
                                Horário
                            </label>
                            <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end"
                >
                    <button
                        type="submit"
                        disabled={loading || !videoFile || selectedAccounts.length === 0 || !scheduledDate || !scheduledTime}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-bg text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Agendar Post
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </div>
    );
}
