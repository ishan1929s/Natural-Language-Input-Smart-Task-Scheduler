import dotenv from "dotenv";
dotenv.config();

import { validateEnvironment } from "../validate-env.js";
import app from "./app.js";
import connectDB from "./db/index.js";
import { startReminderScheduler } from "./services/cron.scheduler.js";

// Validate environment variables
validateEnvironment();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const start = async () => {
  try {
    await connectDB();

    const port = Number(process.env.PORT) || 3000;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);

      // Start the task reminder scheduler
      startReminderScheduler();
    });

    // Graceful shutdown for server
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down server');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
