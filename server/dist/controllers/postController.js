import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
// Generate Post
// POST /api/posts/generate
export const generatePost = async (req, res) => {
    try {
        const { prompt, tone, generateImage } = req.body;
        const geminiKey = process.env.GEMINI_API_KEY;
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        if (!geminiKey) {
            res.status(500).json({
                success: false,
                message: "GEMINI_API_KEY is missing.",
            });
            return;
        }
        // Gemini Client
        const ai = new GoogleGenAI({
            apiKey: geminiKey,
        });
        // Generate Post + Image Prompt
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
Generate a professional social media post.

Prompt:
"${prompt}"

Tone:
${tone}

Requirements:
- Write an engaging social media caption.
- Include relevant hashtags.
- Also generate a highly detailed AI image prompt.
- Return ONLY valid JSON.

Example:
{
  "content":"...",
  "imagePrompt":"..."
}
`,
        });
        let content = "";
        let imagePrompt = prompt;
        try {
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const data = jsonMatch
                ? JSON.parse(jsonMatch[0])
                : {
                    content: rawText,
                    imagePrompt: prompt,
                };
            content = data.content;
            imagePrompt = data.imagePrompt;
        }
        catch {
            content = textResponse.text || "";
            imagePrompt = prompt;
        }
        let mediaUrl = "";
        // Generate Image (Replicate)
        if (generateImage) {
            if (!replicateToken) {
                res.status(500).json({
                    success: false,
                    message: "REPLICATE_API_TOKEN is missing.",
                });
                return;
            }
            const replicate = new Replicate({
                auth: replicateToken,
            });
            try {
                // 60 second timeout
                const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Image generation timed out after 60 seconds.")), 60000));
                const output = (await Promise.race([
                    replicate.run("black-forest-labs/flux-schnell", {
                        input: {
                            prompt: imagePrompt,
                            aspect_ratio: "1:1",
                            output_format: "png",
                            num_outputs: 1,
                        },
                    }),
                    timeout,
                ]));
                if (!Array.isArray(output) || output.length === 0) {
                    throw new Error("Replicate did not return an image.");
                }
                // Temporary Replicate URL
                const tempUrl = output[0].toString();
                // Upload to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(tempUrl, {
                    folder: "ai-generations",
                });
                // Permanent Cloudinary URL
                mediaUrl = uploadResult.secure_url;
            }
            catch (err) {
                console.error("Image generation failed:", err.message);
                // Continue without image
                mediaUrl = "";
            }
        }
        const generation = await Generation.create({
            user: req.user._id,
            prompt,
            content,
            mediaUrl,
            mediaType: mediaUrl ? "image" : undefined,
            tone: tone
        });
        res.status(201).json(generation);
    }
    catch (error) {
        console.error("Generate Post Error:", error);
        res.status(500).json({
            success: false,
            message: error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while generating the post.",
        });
    }
};
//Get generations
// GET /api/posts/generations
export const getGenerations = async (req, res) => {
    try {
        const generations = await Generation.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(generations);
    }
    catch (error) {
        res.status(500).json({ message: error?.message || "Server error" });
    }
};
//Get posts
//GET /api/posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id });
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({ message: err?.message || "Server error" });
    }
};
//Schedule post
//POST /api/posts
export const schedulePost = async (req, res) => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;
        //parse platform if it comes as a stringified array from FormData
        let parsedPlatforms = platforms;
        if (typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            }
            catch (e) {
                parsedPlatforms = platforms.split(" ");
            }
        }
        let mediaUrl = req.body.mediaUrl;
        let mediaType = req.body.mediaType;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    resource_type: "auto",
                    folder: "social-scheduler"
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end(req.file.buffer);
            });
            mediaUrl = result.secure_url;
            mediaType = result.resource_type === "video" ? "video" : "image";
        }
        const post = await Post.create({
            user: req.user._id,
            content,
            platform: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status
        });
        res.status(201).json(post);
    }
    catch (err) {
        res.status(500).json({ message: err?.message || "server error" });
    }
};
