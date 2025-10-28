import React, { useEffect, useState } from "react";

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("...");
  const [error, setError] = useState(null);

  // Function to fetch the prompt
  const fetchPrompt = async () => {
    try {
      const res = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch prompt");
      const data = await res.json();
      setPrompt(data?.slip?.advice || "Try reflecting on your day today.");
    } catch (err) {
      setError("Could not load prompt.");
    }
  };

  useEffect(() => {
    // fetch once immediately
    fetchPrompt();

    // fetch again every 24 hours (ms)
    const interval = setInterval(fetchPrompt, 24 * 60 * 60 * 1000);

    // cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-orange-800 dark:text-zinc-200">{prompt}</p>
      )}
    </div>
  );
};

export default DailyPrompt;
