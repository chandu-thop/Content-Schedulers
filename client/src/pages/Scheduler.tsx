
import {useState,useEffect} from "react";
import type { FormEvent } from "react";
import { CalendarRangeIcon, XIcon,ClockIcon, CalendarDaysIcon } from "lucide-react";

import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { PLATFORMS } from "../assets/assets";
export default function Scheduler() {
  const [content,setContent]=useState("");
  const [scheduledDate,setScheduledDate]=useState("");
  const [scheduledTime,setScheduledTime]=useState("");
  const [selectedPlatforms,setSelectedPlatforms]=useState<string[]>([]);
  const [mediaFile,setMediaFile]=useState<File|null>(null);
  const [previewUrl,setPreviewUrl]=useState<string | null>(null);
  const [loading,setLoading]=useState(false);
   useEffect(()=>{
    // Posts fetch setup can be added here if needed
   },[]);
   const togglePlatform=(id:string)=>setSelectedPlatforms((prev)=>(
     prev.includes(id) ? prev.filter((p)=>p!==id) : [...prev,id]
   ));
   
   

   const handleSchedule = async (e:FormEvent)=>{
    e.preventDefault();
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },1000)
   }




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
                    className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 ${
                      active
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
                 <input type="date"  required
                 className="w-full pl-10 pr-4 py-2.5
                 bg-slate-50 border border-slate-200 rounded-lg text-slate-900
                 text-sm outline-none" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)}/>
              </div>
            </div>
             <div>
              <label className="block text-xs text-slate-500 uppercase mb-2">Time</label>
              <div className="relative">
                 <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2
                 text-slate-400 pointer-events-none"/>
                 <input type="time"  required
                 className="w-full pl-10 pr-4 py-2.5
                 bg-slate-50 border border-slate-200 rounded-lg text-slate-900
                 text-sm outline-none" value={scheduledTime} onChange={(e)=>setScheduledTime(e.target.value)}/>
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <CalendarDaysIcon className="size-5 text-slate-500"/>
            <h3 className="text-slate-900 font-medium">Upcoming</h3>
            <span className="ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">1</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-50">
              <div className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="size-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Image</span>
                      <span className="text-xs text-slate-400">5/19/2026, 7:39:00 PM</span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">Exciting Opportunity: Data Analyst! Are you a highly analytical professional passionate about transforming complex data into strategi...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Published Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-96">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
            <svg className="size-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.894-6.447m0 0l9-9m-9 9l-6.894-6.447" /></svg>
            <h3 className="text-slate-900 font-medium">Published</h3>
            <span className="ml-auto text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">8</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-50">
              <div className="px-5 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="size-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.25-.129.599-.129.948v5.439h-3.554s.046-8.827 0-9.745h3.554v1.378c-.009.015-.021.029-.03.042h.03v-.042c.429-.646 1.196-1.564 2.913-1.564 2.126 0 3.72 1.389 3.72 4.375v5.556zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.959.77-1.716 1.964-1.716 1.192 0 1.924.757 1.955 1.716 0 .953-.763 1.715-1.954 1.715zm1.608 11.019H3.721V9.707h3.224v10.745zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">5/8/2026, 1:35:02 PM</span>
                      <span className="text-xs font-medium text-emerald-600">Published</span>
                    </div>
                    <p className="text-sm text-slate-700">Hi Everyone</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="size-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.25-.129.599-.129.948v5.439h-3.554s.046-8.827 0-9.745h3.554v1.378c-.009.015-.021.029-.03.042h.03v-.042c.429-.646 1.196-1.564 2.913-1.564 2.126 0 3.72 1.389 3.72 4.375v5.556zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.959.77-1.716 1.964-1.716 1.192 0 1.924.757 1.955 1.716 0 .953-.763 1.715-1.954 1.715zm1.608 11.019H3.721V9.707h3.224v10.745zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">5/12/2026, 11:44:02 AM</span>
                      <span className="text-xs font-medium text-emerald-600">Published</span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">Artificial Intelligence is no longer a futuristic concept; it's a transformative force reshaping our world today. From powering sophisticated analytics and automatin...</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="size-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.25-.129.599-.129.948v5.439h-3.554s.046-8.827 0-9.745h3.554v1.378c-.009.015-.021.029-.03.042h.03v-.042c.429-.646 1.196-1.564 2.913-1.564 2.126 0 3.72 1.389 3.72 4.375v5.556zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.959.77-1.716 1.964-1.716 1.192 0 1.924.757 1.955 1.716 0 .953-.763 1.715-1.954 1.715zm1.608 11.019H3.721V9.707h3.224v10.745zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">5/12/2026, 11:56:02 AM</span>
                      <span className="text-xs font-medium text-emerald-600">Published</span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">Unlock your potential in the rapidly evolving world of Artificial Intelligence. Our comprehensive AI course is meticulously designed for professionals and aspiring...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
