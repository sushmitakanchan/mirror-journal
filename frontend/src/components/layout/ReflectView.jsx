import React , {useRef, useEffect, useMemo} from 'react'
import DOMPurify from "dompurify";
import { Link } from 'react-router-dom';
import { endpoints } from '@/lib/apiEndpoints.js';
import image from '../../assets/image.png'
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";

const convertImagesToUrls = (html = "") => {
  if (!html || typeof window === "undefined") return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    const replacement = doc.createElement("p");

    if (src) {
      let linkLabel = "Attached image";

      try {
        const url = new URL(src);
        const pathSegment = url.pathname.split("/").filter(Boolean).pop();
        const decodedSegment = pathSegment ? decodeURIComponent(pathSegment) : "";
        linkLabel = decodedSegment || "Attached image";
      } catch {
        linkLabel = "Attached image";
      }

      const link = doc.createElement("a");
      link.href = src;
      link.textContent = `📎 ${linkLabel}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.style.wordBreak = "break-all";
      replacement.appendChild(link);
    } else {
      replacement.textContent = "Image";
    }

    img.replaceWith(replacement);
  });

  return doc.body.innerHTML;
};

const ReflectView = () => {
    const {id} = useParams();
    const location = useLocation();
    const entry =  location.state?.entry;
    const initialAiReply = entry?.aiReply || "";
    const entryContentHtml = useMemo(() => convertImagesToUrls(entry?.content || ""), [entry?.content]);
    
    // const [followUpReply, setFollowUpReply] = useState("")
    // const [userMessage, setUserMessage] = useState(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
     const scrollRef = useRef(null);
    const [messages, setMessages] = useState([
      {from:"user", html:entryContentHtml},
      ...(initialAiReply ? [{from: "ai", text:initialAiReply}]:[]),
      {from:"ai", text:"Do you want to dive deeper into this?"},
    ])

    useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

    const handleReflect = async(e)=>{
      e.preventDefault();
      if(!input.trim())return;
      setInput(""); 
      const message = input.trim();
        setMessages((m)=>[...m,{from:"user", text: message}]);
        setLoading(true);
      try {
        const res = await fetch(endpoints.getReflectById(id), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
      const data = await res.json();
      setMessages((m) => [...m, { from: "ai", text: data.aiReply || "No reply." }]);
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    }
  return (
    <div>
      <div className="px-4 sm:px-6">
              <Link to="/archives" className="text-md cursor-pointer text-orange-600 hover:text-orange-700 dark:text-[#e0b38f] dark:hover:text-[#f3c69c]">
                ← Back to Archives
              </Link>
    </div>
    <div className="flex flex-col md:flex-row md:min-h-screen mx-2 sm:mx-6 md:mx-10 my-6 gap-6">
      {/* LEFT: Image side — hidden on mobile */}
      <div className="hidden md:block md:w-2/5 w-full h-[80vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-xl ml-0 md:ml-20">
        {/* Use <img> for precise focal control */}
        <img
          src={image}
          alt="Decorative"
          className="reflect-hero-image w-full h-4/4 object-[30%_50%]" 
        />
      </div>
      <div className="w-full md:w-3/4 h-[80vh] sm:h-[85vh] md:h-[90vh] rounded-3xl shadow-lg relative overflow-hidden dark:shadow-[0_24px_60px_rgba(5,3,2,0.45)]">
        {/* Glass overlay panel */}
        <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col">
          {/* Frosted glass panel itself */}
          <div className="relative z-10 flex flex-1 flex-col rounded-2xl border border-white/10 bg-white/10 p-3 sm:p-4 md:p-6 text-black shadow-inner backdrop-blur-sm dark:border-[#4b3229] dark:bg-[linear-gradient(180deg,rgba(42,29,24,0.82),rgba(30,21,18,0.9))] dark:text-[#f1e3d5]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-lg dark:bg-[#5a3a2d] dark:text-[#f7e4d2]">AI</div>
                <div>
                  <div className= "text-black dark:text-[#f4e7d7] font-semibold">Reflect Chat</div>
                  <div className="text-black dark:text-[#cfb4a1] text-sm">Your private assistant</div>
                </div>
              </div>
              <div className="text-sm text-orange-600 dark:text-[#efbd97]">Online</div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-auto mb-4 space-y-3 pr-2">
            {messages.map((m, i) => {
              const user = m.from === "user";
              const base = "max-w-[80%] rounded-xl p-3";
              const cls = user
                ? `${base} ml-auto bg-amber-100 dark:bg-[#4f3426] dark:text-[#f8e6d5]`
                : `${base} bg-white/80 dark:bg-[#2d1f1b] dark:text-[#f1e3d5]`;
              return (
                <div key={i} className={cls}>
                  {m.html ? (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(m.html) }} />
                  ) : (
                    <div>{m.text}</div>
                  )}
                </div>
              )
            })}
            {loading && (
            <div className="max-w-[80%] rounded-xl bg-white/10 p-3 text-black dark:bg-[#35251f] dark:text-[#f1e3d5]">
            Reflecting...
            </div>
            )}

            {/* {followUpReply  && !loading && (
            <div className="max-w-[80%] bg-white/80 text-black rounded-xl p-3">
            {followUpReply }
            </div>
            )} */}
          </div>
            {/* Input area */}
            <form onSubmit={handleReflect} className="mt-2 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-black outline placeholder-black/60 focus:border-white/20 dark:border-[#4d3429] dark:bg-[#241916] dark:text-[#f1e3d5] dark:placeholder:text-[#b59a87]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white/30 px-4 py-2 font-semibold text-black transition hover:bg-white/40 dark:bg-[#c97750] dark:text-[#1d120e] dark:hover:bg-[#de8960]"
              >
                {loading ? "…" : "Send"}
              </button>
            </form>
          </div>

          {/* Optional decorative gradient behind the panel to enhance glass look */}
          <div className="absolute -left-10 -top-10 w-72 h-72 rounded-full bg-gradient-to-br from-pink-400/30 to-orange-300/20 blur-3xl pointer-events-none"></div>
        </div>
      </div>
</div>
      </div>
  )
}

export default ReflectView
