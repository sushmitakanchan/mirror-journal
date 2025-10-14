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
            where:{user:user.id},
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
    res.status(201).json(newEntry);
    console.log("createEntry body:", req.body, "req.auth:", req.auth);
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
        const {title, content, imageUrl} = req.body;

        const user = await prisma.user.findUnique({
            where:{clerkUserId},
        })

        const entry = await prisma.entry.findUnique({
            where:{id},
        })

        if(!entry || entry.userId !== user.id)
             return res.status(403).json({ error: "Not authorized" });
        
        const updated = await prisma.entry.update({
            where:{id},
            date:{title, content, imageUrl},
        })
        res.json(updated);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to update entry" });
    }
}

// Delete an entry
export const deleteEntry = async(req, res)=>{
    
}