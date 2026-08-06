import cron from "node-cron";
import { Post } from "../models/Post.js";
import Account from "../models/Account.js";
import { ActivityLog } from "../models/ActivityLog.js";
import zernio from "../config/zernio.js";

export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublish = await Post.find({ scheduledFor: { $lte: now }, status: "scheduled" });

            for (const post of postsToPublish) {
                try {
                    const accounts = await Account.find({
                        user: post.user,
                        platform: { $in: post.platform },
                        status: "connected",
                        zernioAccountId: { $exists: true }
                    });

                    if (!accounts || accounts.length === 0) {
                        console.log(`No connected Zernio accounts found for post ${post._id}`);
                        // mark failed or skip depending on business logic; here we skip
                        continue;
                    }

                    const zernioPlatforms = accounts.map((acc: any) => ({
                        platform: acc.platform,
                        accountId: acc.zernioAccountId
                    }));

                    const payload: any = {
                        content: post.content,
                        publishNow: true,
                        platforms: zernioPlatforms
                    };

                    if (post.mediaUrl) {
                        payload.mediaItems = [{ type: post.mediaType || "image", url: post.mediaUrl }];
                    }

                    console.log(`Publishing post ${post._id} to Zernio with media: ${post.mediaUrl || "none"}`);

                    const response = await zernio.posts.createPost({ body: payload });
                    const publishedPost = (response.data as any)?.post || response.data;

                    if (!publishedPost) {
                        throw new Error("Failed to get post object from Zernio response");
                    }

                    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`);

                    post.status = "published";
                    await post.save();

                    // create activity logs for each account/platform
                    for (const acc of accounts) {
                        await ActivityLog.create({
                            user: post.user,
                            actionType: "POST_PUBLISHED",
                            description: `Published post to ${acc.platform}`,
                            relatedPost: post._id,
                            platform: acc.platform
                        });
                    }
                } catch (error: any) {
                    console.log(`Failed to publish post ${post._id}:`, error?.response?.data || error?.message || error);
                    try {
                        post.status = "failed";
                        await post.save();
                    } catch (saveErr) {
                        console.log("Failed to update post status to failed:", saveErr);
                    }
                }
            }

            if (postsToPublish.length > 0) {
                console.log(`Evaluated ${postsToPublish.length} posts for publishing at ${now.toISOString()}`);
            }
        } catch (error) {
            console.log("Error in scheduler:", error);
        }
    });

    console.log("Scheduler service initialized.");
};