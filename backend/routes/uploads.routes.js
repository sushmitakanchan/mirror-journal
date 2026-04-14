import express from "express";
import { requireAuth } from "@clerk/express";
import { signImageUpload } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/sign-image", requireAuth(), signImageUpload);

export default router;
