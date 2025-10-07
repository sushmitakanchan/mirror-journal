import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import userRoutes from '../routes/user.routes.js';
import entryRoutes from '../routes/entries.routes.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(
    cors({
        origin:"https://localhost:3000",
        credentials:true,
        methods:['GET', 'POST', 'DELETE'],
        allowedHeaders:['Content-Type', 'Authorization']
    })
)

app.use('/users', userRoutes)
app.use('/entries', ClerkExpressRequireAuth(), entryRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
    
})