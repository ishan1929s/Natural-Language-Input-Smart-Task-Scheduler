import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { transcribeAudio } from "../services/speech.services.js";
import { parse } from "../services/nlp.services.js";
import { Task } from "../models/task.model.js";
import multer from "multer";

// Configure multer for audio uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed'), false);
        }
    }
});

// Transcribe audio to text
const transcribeVoiceToText = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Audio file is required");
    }

    try {
        const audioBuffer = req.file.buffer;
        const transcribedText = await transcribeAudio(audioBuffer);
        
        return res.status(200).json(new ApiResponse(200, "Audio transcribed successfully", {
            text: transcribedText,
            originalFilename: req.file.originalname,
            fileSize: req.file.size
        }));
    } catch (error) {
        throw new ApiError(500, `Transcription failed: ${error.message}`);
    }
});

// Transcribe audio and parse it into a task
const createTaskFromVoice = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Audio file is required");
    }

    try {
        // Step 1: Transcribe audio to text
        const audioBuffer = req.file.buffer;
        const transcribedText = await transcribeAudio(audioBuffer);
        
        // Step 2: Parse the transcribed text using NLP
        const parsedTask = await parse(transcribedText, {
            userId: req.user.id,
            timezone: req.body.timezone || 'UTC',
            locale: req.body.locale || 'en',
            defaultDuration: parseInt(req.body.defaultDuration) || 60
        });
        
        return res.status(200).json(new ApiResponse(200, "Voice input processed successfully", {
            transcribedText,
            parsedTask,
            originalFilename: req.file.originalname,
            fileSize: req.file.size
        }));
    } catch (error) {
        throw new ApiError(500, `Voice processing failed: ${error.message}`);
    }
});

// Create task directly from voice input
const createTaskFromVoiceDirect = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "Audio file is required");
    }

    try {
        // Step 1: Transcribe audio to text
        const audioBuffer = req.file.buffer;
        const transcribedText = await transcribeAudio(audioBuffer);
        
        // Step 2: Parse the transcribed text using NLP
        const parsedTask = await parse(transcribedText, {
            userId: req.user.id,
            timezone: req.body.timezone || 'UTC',
            locale: req.body.locale || 'en',
            defaultDuration: parseInt(req.body.defaultDuration) || 60
        });
        
        // Step 3: Create the task in database
        const task = await Task.create({
            title: parsedTask.title,
            description: parsedTask.description,
            deadline: parsedTask.deadline,
            priority: parsedTask.priority,
            category: parsedTask.category,
            time_required: parsedTask.time_required,
            natural_language_input: transcribedText,
            auto_categorized: true,
            owner: req.user.id
        });
        
        return res.status(201).json(new ApiResponse(201, "Task created from voice input successfully", {
            task,
            transcribedText,
            parsedTask,
            originalFilename: req.file.originalname,
            fileSize: req.file.size
        }));
    } catch (error) {
        throw new ApiError(500, `Voice task creation failed: ${error.message}`);
    }
});

export { 
    transcribeVoiceToText, 
    createTaskFromVoice, 
    createTaskFromVoiceDirect,
    upload 
};
