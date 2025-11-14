import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const getReflectById = async(req, res)=>{
    try {
        const {id} = req.params;
        const { message: userMessage } = req.body;
        const entry = await prisma.entry.findUnique({ where: { id } });
        if(!entry) return res.status(404).json({error:"Entry not found"})
        
        const messages = [
            {
                role:"system",
                content:"You are a calm and thoughtful assistant. Reflect briefly and kindly.",
            },
            {
                role:"user",
                content:entry.content,
            }
        ]
           if (userMessage && typeof userMessage === "string" && userMessage.trim() !== "") {
                messages.push({
                role: "user",
                content: userMessage.trim(),
            });
            }
                
         const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method:"POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: 80,
            })

        })

        const data = await response.json();
        //  console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
        const aiReply = (data.choices?.[0]?.message?.content || "No reply received.").trim();

    if (!entry.aiReply) {
      await prisma.entry.update({
        where: { id },
        data: { aiReply },
      });
    }
        return res.status(200).json({ aiReply });   
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error:"Something went wrong", details: err?.message})
    }

}