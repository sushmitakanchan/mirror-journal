import express from "express";

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express"; 
import userRoutes from '../routes/user.routes.js';
import entryRoutes from '../routes/entries.routes.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(clerkMiddleware());
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
        methods:['GET', 'POST', 'DELETE'],
        allowedHeaders:['Content-Type', 'Authorization']
    })
)

app.use('/users', userRoutes)
app.use('/entries', requireAuth(), entryRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    // console.log("CLERK_PUBLISHABLE_KEY:", !!process.env.CLERK_PUBLISHABLE_KEY);
    // console.log("CLERK_SECRET_KEY:", !!process.env.CLERK_SECRET_KEY);

    
})