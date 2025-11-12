import React from 'react'
import { Link } from 'react-router-dom';
import image from '../../assets/image.png'
import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import { useEntries } from '@/context/EntriesContext';

const ReflectView = () => {
    const {id} = useParams();
    const {entries} = useEntries();
    const location = useLocation();
    const entry =  location.state?.entry;
    const [userMessage, setUserMessage] = useState(null);

    const [input, setInput] = useState(entry?.content || "");
    const [aiReply, setAiReply] = useState(entry?.aiReply || "");
    const [loading, setLoading] = useState(false);

    

    const handleReflect = async(e)=>{
      e.preventDefault();
      if(!input.trim())return;

      // setLoading(true);
        setUserMessage(input);
        const currentMessage = input;
        setInput(""); // clears input box
        setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/reflect/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: currentMessage }),
        });
      const data = await res.json();
      const reply = data.aiReply || data.reflection || data.entry?.aiReply || entry?.aiReply || "No reply received.";
      setAiReply(reply);
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    }
  return (
    <div>
      <div className="px-30">
              <Link to="/archives" className="text-md text-orange-600 hover:text-orange-700 cursor-pointer dark:text-orange-300 dark:hover:text-orange-400">
                ← Back to Archives
              </Link>
    </div>
    <div className="min-h-screen flex flex-col md:flex-row mx-10 my-6 gap-6">
      {/* LEFT: Image side */}
      <div className="md:w-2/5 w-full h-[80vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-xl ml-20">
        {/* Use <img> for precise focal control */}
        <img
          src={image}
          alt="Decorative"
          className="w-full h-4/4 object-[30%_50%]" 
        />
      </div>
      <div className="md:w-3/4 w-full h-[70vh] md:h-[90vh] rounded-3xl shadow-lg relative overflow-hidden">
        {/* Glass overlay panel */}
        <div className="absolute inset-0 p-6 flex flex-col">
          {/* Frosted glass panel itself */}
          <div className="relative z-10 flex-1 rounded-2xl p-6 backdrop-blur-sm bg-white/10 border border-white/10 shadow-inner flex flex-col text-black dark:text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-lg">AI</div>
                <div>
                  <div className= "text-black dark:text-white font-semibold">Reflect Chat</div>
                  <div className="text-black dark:text-white text-sm">Your private assistant</div>
                </div>
              </div>
              <div className="text-sm text-orange-600 dark:text-white">Online</div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-auto mb-4 space-y-3 pr-2">
            <div className="ml-60 self-end max-w-[80%] bg-amber-100 text-black dark:text-white rounded-xl p-3">
              {input.replace(/<[^>]+>/g, '')}
            </div>
            {/* <div className="max-w-[80%] bg-white/80 text-black rounded-xl p-3">
            {entries.aiReply}
            </div>           */}
            <div className="max-w-[80%] bg-white/80 text-black rounded-xl p-3">Hi, how can I help with your reflection today?</div>
             {userMessage && (
            <div className="ml-60 self-end max-w-[80%] bg-amber-100 text-black dark:text-white rounded-xl p-3">
              {userMessage}
            </div>
            )}
            {loading && (
            <div className="max-w-[80%] bg-white/10 text-black dark:text-white rounded-xl p-3">
            Reflecting...
            </div>
            )}

            {aiReply && !loading && (
            <div className="max-w-[80%] bg-white/80 text-black rounded-xl p-3">
            {aiReply}
            </div>
            )}
          </div>
            {/* Input area */}
            <form onSubmit={handleReflect} className="mt-2 flex items-center gap-3">
              <input
                type="text"
                value={input.replace(/<[^>]+>/g, '')}
                onChange={(e)=>setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 placeholder-black/60 text-black dark:text-white rounded-full px-4 py-2 outline border border-white/10 focus:border-white/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-full bg-white/30 text-black dark:text-white font-semibold hover:bg-white/40 transition"
              >
                {loading ? "Reflecting..." : "Send"}
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
