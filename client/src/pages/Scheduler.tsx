
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { CalendarRangeIcon, XIcon, ClockIcon, CalendarDaysIcon } from "lucide-react";

import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { PLATFORMS } from "../assets/assets";

export default function Scheduler() {
  const { apiFetch } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const data = await apiFetch("/api/posts");
      setPosts(data);
    } catch (e: any) {
      console.error("Error fetching posts:", e);
      showToast("Error fetching scheduled posts: " + (e.message || e), "error");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [apiFetch]);

  const togglePlatform = (id: string) => setSelectedPlatforms((prev) => (
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  ));

  const handleSchedule = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      showToast("Please select at least one platform", "warning");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("platforms", JSON.stringify(selectedPlatforms));

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      formData.append("scheduledFor", scheduledDateTime.toISOString());
      formData.append("status", "scheduled");

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      await apiFetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      // Reset form
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      setPreviewUrl(null);

      showToast("Post scheduled successfully!", "success");
      // Refresh list
      await fetchPosts();
    } catch (err: any) {
      showToast("Failed to schedule post: " + (err.message || err), "error");
    } finally {
      setLoading(false);
    }
  };

  const upcomingPosts = posts.filter(p => p.status === "scheduled");
  const publishedPosts = posts.filter(p => p.status === "published");

  return (
    <div className="flex flex-col h-full px-6">
      <div className="grid grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Form - Left */}
        <div className="col-span-2">
          <form onSubmit={handleSchedule} className="bg-white rounded-2xl border border-slate-200 p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg text-slate-700">Compose Post</h3>
            </div>

            {/* Platforms */}
            <div className="mb-4">
              <label className="block text-xs text-slate-500 uppercase mb-2">PLATFORMS</label>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${active
                        ? "bg-red-50 border-red-300 text-red-500"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}>
                      <p.icon className="size-4.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">CONTENT</label>
              <textarea
                required
                rows={5}
                placeholder="What do you want to share today?"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex items-center justify-end mt-3">
                <div className={`text-xs font-medium ${content.length > 270 ? "text-red-500" : "text-slate-400"}`}>
                  {content.length}/280
                </div>
              </div>
            </div>
            {/*media upload*/}
            <div className="mb-2">
              <label className="block text-xs text-slate-500 uppercase mb-2">Media(optional)</label>
              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {previewUrl ? (
                    mediaFile.type.startsWith("image/") ? (
                      <img src={previewUrl} alt="preview" className="w-full h-40 object-cover" />
                    ) : (
                      <video src={previewUrl} className="w-full h-40 object-cover" controls />
                    )
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors">
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group">
                  <span className="text-sm text-slate-500 group-hover:text-red-600 transition-colors">Click to upload image or video</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setMediaFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                  />
                </label>
              )}
            </div>
            {/* Date & Time*/}
            <div className="grid grid-sols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">Date</label>
                <div className="relative">
                  <CalendarRangeIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2
                 text-slate-400 pointer-events-none"/>
                  <input type="date" required
                    className="w-full pl-10 pr-4 py-2.5
                 bg-slate-50 border border-slate-200 rounded-lg text-slate-900
                 text-sm outline-none" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase mb-2">Time</label>
                <div className="relative">
                  <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2
                 text-slate-400 pointer-events-none"/>
                  <input type="time" required
                    className="w-full pl-10 pr-4 py-2.5
                 bg-slate-50 border border-slate-200 rounded-lg text-slate-900
                 text-sm outline-none" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                </div>
              </div>


            </div>

            {/* Submit */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 disabled:opacity-60">
                {loading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </form>
        </div>

        {/* Upcoming & Published - Right */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* Upcoming Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-72">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <CalendarDaysIcon className="size-5 text-slate-500" />
              <h3 className="text-slate-900 font-medium">Upcoming</h3>
              <span className="ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{upcomingPosts.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50">
                {upcomingPosts.map((post) => (
                  <div key={post._id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1.5">
                        {post.platform && post.platform.map((pId: string) => {
                          const pf = PLATFORMS.find(p => p.id === pId);
                          if (!pf) return null;
                          const Icon = pf.icon;
                          return <Icon key={pId} className="size-4 text-slate-500" />;
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">{post.mediaUrl ? "Media Post" : "Text Post"}</span>
                          <span className="text-xs text-slate-400">{new Date(post.scheduledFor).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                        {post.mediaUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden max-w-xs border border-slate-100">
                            <img src={post.mediaUrl} alt="media" className="h-20 object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingPosts.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-450 text-slate-400">
                    No upcoming posts scheduled.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Published Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-96">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
              <svg className="size-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.894-6.447m0 0l9-9m-9 9l-6.894-6.447" /></svg>
              <h3 className="text-slate-900 font-medium">Published</h3>
              <span className="ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{publishedPosts.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50">
                {publishedPosts.map((post) => (
                  <div key={post._id} className="px-5 py-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1.5">
                        {post.platform && post.platform.map((pId: string) => {
                          const pf = PLATFORMS.find(p => p.id === pId);
                          if (!pf) return null;
                          const Icon = pf.icon;
                          return <Icon key={pId} className="size-4 text-slate-500" />;
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">{new Date(post.scheduledFor).toLocaleString()}</span>
                          <span className="text-xs font-medium text-emerald-600">Published</span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                        {post.mediaUrl && (
                          <div className="mt-2 rounded-lg overflow-hidden max-w-xs border border-slate-100">
                            <img src={post.mediaUrl} alt="media" className="h-20 object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {publishedPosts.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-450 text-slate-400">
                    No published posts yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
