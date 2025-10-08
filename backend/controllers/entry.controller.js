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
            orderBy:{createdAt:desc},
        });

        res.json(entries)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch entries" });
    }
}

// Create a new entry
export const createEntry = async(req, res)=>{
    
}

// Update an entry (only if it belongs to user)
export const updateEntry = async(req, res)=>{
    
}

// Delete an entry
export const deleteEntry = async(req, res)=>{
    
}