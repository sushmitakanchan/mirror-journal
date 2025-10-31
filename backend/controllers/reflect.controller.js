import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const getReflect = async(req, res)=>{
    try {
        const {content} = req.body;
        const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body:JSON.stringify({
                model,
                messages: [{
                role: "system",
                content:
                    "You are a calm and thoughtful assistant. Reflect briefly on what the user wrote in a kind, introspective way.",
                },
                { 
                    role: "user", 
                    content: content 
                },
                ],
                max_tokens: 100,
            })
        });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI non-OK:", response.status, errText);
      return res.status(502).json({ error: "LLM provider error", status: response.status, detail: errText });
    }

        const data = await response.json();
        console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
        const aiReply = data.choices?.[0]?.message?.content || "No reply received.";
        if (!aiReply) {
  // return proper error with full OpenAI JSON
  return res.status(500).json({
    error: "No assistant text received from OpenAI",
    rawProviderResponse: data
  });
}
        res.json({reflection: aiReply.trim()})
    } catch (error) {
        console.error("OPENAI error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
}

export const getReflectById = async(req, res)=>{
    try {
        const {id} = req.params
        const entry = await prisma.entry.findUnique({ where: { id } });
        if(!entry) return res.status(404).json({error:"Entry not found"})
        
         const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method:"POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                   {
                    role: "system",
                    content:
                        "You are a calm and thoughtful assistant. Reflect briefly on what the user wrote in a kind, introspective way.",
                   },
                   { role: "user", content: entry.content },
                ],
                max_tokens: 80,
            })

        })

        const data = await response.json();
        //  console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
        const aiReply = (data.choices?.[0]?.message?.content || "No reply received.").trim();

        const updated = await prisma.entry.update({
            where: { id },
            data:{aiReply}
        })
        return res.status(200).json({ aiReply, entry: updated });   
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error:"Something went wrong", details: err?.message})
    }

}