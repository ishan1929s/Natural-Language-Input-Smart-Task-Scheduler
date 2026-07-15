import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  archiveTask,
  unarchiveTask,
  markTaskAsCompleted,
  markTaskAsPending,
  addComment,
  getComments,
  SearchTasks,
  filterTasksByCategory,
  sortTasksByDeadlineascending,
  sortTasksByDeadlineDescending,
  sortTasksByCreationDate,
  sortTasksByTimeRequired,
  parseNaturalLanguage,
  createRecurringTask,
  updateRecurringTask,
  deleteRecurringTask,
  getRecurringTasks,
  getRecurringTaskInstances,
  getReminderStatsController,
  scheduleReminder,
  checkDeadlines,
  sendWelcomeEmailToUser
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/search", SearchTasks);
router.get("/category/:category", filterTasksByCategory);
router.get("/sort/deadline", sortTasksByDeadlineascending);
router.get("/sort/priority", sortTasksByDeadlineDescending);
router.get("/sort/created", sortTasksByCreationDate);
router.get("/sort/time-required", sortTasksByTimeRequired);
router.get("/analytics", getTasks); // Placeholder for analytics

// Recurring task routes (must come before generic :taskId routes)
router.post("/recurring", createRecurringTask);
router.get("/recurring", getRecurringTasks);
router.get("/recurring/:taskId/instances", getRecurringTaskInstances);
router.put("/recurring/:taskId", updateRecurringTask);
router.delete("/recurring/:taskId", deleteRecurringTask);

router.patch("/:taskId/archive", archiveTask);
router.patch("/:taskId/unarchive", unarchiveTask);
router.patch("/:taskId/complete", markTaskAsCompleted);
router.patch("/:taskId/pending", markTaskAsPending);
router.post("/:taskId/comments", addComment);
router.get("/:taskId/comments", getComments);
router.post("/:taskId/reminder", scheduleReminder);
router.get("/:taskId", getTaskById);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/nlp/parse", parseNaturalLanguage);

// Reminder routes
router.get("/reminders/stats", getReminderStatsController);
router.get("/deadlines/check", checkDeadlines);
router.post("/send-welcome-email", sendWelcomeEmailToUser);

export default router;


