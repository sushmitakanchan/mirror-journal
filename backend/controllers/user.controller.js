import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export const syncUser = async(req, res)=>{
    try {
        const {clerkUserId, email, name, imageUrl} = req.body;
        //check if user exists in DB
        let user = await prisma.user.findUnique({
            where:{clerkUserId},
        });
        // if not, create new user
        if(!user){
            user=await prisma.user.create({
                data:{
                    clerkUserId,
                    email,
                    name,
                    ImageUrl: imageUrl,
                },
            });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to sync user" });
    }
};

export const getCurrentUser = async(req, res)=>{
    try {
        const clerkUserId = req.auth?.userId;
        const user = await prisma.user.findUnique({
            where:{clerkUserId},
            include:{entries:true},
        })
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
         console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
}