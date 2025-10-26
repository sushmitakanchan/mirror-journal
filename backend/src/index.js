import express from "express";
import reflectRoutes from '../routes/reflect.routes.js'

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import { clerkMiddleware } from "@clerk/express"; 
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
        methods:['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders:['Content-Type', 'Authorization']
    })
)

app.use('/users', userRoutes)
app.use('/entries', entryRoutes)
app.use('/api', reflectRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    // console.log("CLERK_PUBLISHABLE_KEY:", !!process.env.CLERK_PUBLISHABLE_KEY);
    // console.log("CLERK_SECRET_KEY:", !!process.env.CLERK_SECRET_KEY);
    
})