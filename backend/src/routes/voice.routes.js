import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    transcribeVoiceToText, 
    createTaskFromVoice, 
    createTaskFromVoiceDirect,
    upload 
} from "../controllers/voice.controller.js";

const router = Router();

// All voice routes require authentication
router.use(verifyJWT);

// Transcribe audio to text only
router.post("/transcribe", upload.single('audio'), transcribeVoiceToText);

// Transcribe audio and parse it into task data (but don't create task)
router.post("/parse", upload.single('audio'), createTaskFromVoice);

// Transcribe audio and create task directly
router.post("/create-task", upload.single('audio'), createTaskFromVoiceDirect);

export default router;
