import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

// Get all entries for the current user
export const getEntries = async(req, res)=>{
    try {
        const clerkUserId = req.auth.userId;

        const user = await prisma.user.findUnique({
            where:{clerkUserId}
        })

        if(!user) return res.status(404).json({error:"User not found."})
        
        const entries = await prisma.entry.findMany({
            where:{userId:user.id},
            orderBy:{createdAt:"desc"},
        });
        
        res.json(entries)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch entries" });
    }
}

// Create a new entry
export const createEntry = async(req, res)=>{
 try {
       const clerkUserId = req.auth.userId;
    const {title, content, mood, imageUrl} = req.body;

    const user = await prisma.user.findUnique({
        where:{clerkUserId}
    })
    if(!user) return res.status(404).json({error: "User not found"});
    
    const newEntry = await prisma.entry.create({
        data:{
            title,
            content,
            mood,
            imageUrl,
            userId: user.id
        }
    })
    // res.status(201).json(newEntry);
    // call to openAI to generate AiReply
    let aiReply = null;
    // const entry = await prisma.entry.findUnique({ where: { id } });
    //     if(!entry) return res.status(404).json({error:"Entry not found"})
    try {
            
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
                       { role: "user", content: newEntry.content },
                    ],
                    max_tokens: 80,
                })
    
            })
    
            const data = await response.json();
            //  console.log("OpenAI raw response:", JSON.stringify(data, null, 2));
            aiReply = (data.choices?.[0]?.message?.content || "No reply received.").trim();
        } 
        catch (error) {
            console.error("OpenAI request failed:", error);
            aiReply = "No reply received.";
        }

        const updated = await prisma.entry.update({
            where: { id: newEntry.id },
            data:{aiReply}
        })
        return res.status(201).json({ updated });  
    // console.log("createEntry body:", req.body, "req.auth:", req.auth);
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create entry" });
 }
}

// Update an entry (only if it belongs to user)
export const updateEntry = async(req, res)=>{
    try {
        const clerkUserId = req.auth.userId;
        const {id} = req.params;
        const {title, content, imageUrl, mood} = req.body;

        const user = await prisma.user.findUnique({
            where:{clerkUserId},
        })

        if (!user) return res.status(404).json({ error: "User not found" });

        const entry = await prisma.entry.findUnique({
            where:{id},
        })

        if(!entry || entry.userId !== user.id)
             return res.status(403).json({ error: "Not authorized" });
        
        const updated = await prisma.entry.update({
            where:{id},
            data:{title, content, imageUrl, mood},
        })
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update entry" });
    }
}

// Delete an entry
export const deleteEntry = async(req, res)=>{

    try {
        const {id} = req.params;
        await prisma.entry.delete({where:{id}});
        res.status(200).json({
            success:true,
            message:"Entry deleted successfully"
        })

    } catch (error) {
        console.error("Error deleting entry", error);
        res.status(500).json({error:"Failed to delete entry"})
    }
    
}