import cron from 'node-cron';
import { checkUpcomingDeadlines, checkOverdueTasks } from './reminder.scheduler.js';

// Schedule reminder checks
export const startReminderScheduler = () => {
    console.log('Starting reminder scheduler...');
    
    // Check for upcoming deadlines every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
        console.log('Checking upcoming deadlines...');
        try {
            const results = await checkUpcomingDeadlines();
            if (results.length > 0) {
                console.log(`Sent ${results.length} deadline reminders`);
            }
        } catch (error) {
            console.error('Error in deadline check:', error);
        }
    });
    
    // Check for overdue tasks every hour
    cron.schedule('10 * * * *', async () => { 
        console.log('Checking overdue tasks...');
        try {
            const results = await checkOverdueTasks();
            if (results.length > 0) {
                console.log(`Sent ${results.length} overdue reminders`);
            }
        } catch (error) {
            console.error('Error in overdue check:', error);
        }
    });
    
    // Daily cleanup and summary at 9 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily reminder summary...');
        try {
            const upcomingResults = await checkUpcomingDeadlines();
            const overdueResults = await checkOverdueTasks();
            
            console.log(`Daily reminder summary: ${upcomingResults.length} upcoming, ${overdueResults.length} overdue`);
        } catch (error) {
            console.error('Error in daily summary:', error);
        }
    });
    
    console.log('Reminder scheduler started successfully');
};

// Stop the scheduler
export const stopReminderScheduler = () => {
    console.log('Stopping reminder scheduler...');
    cron.getTasks().forEach(task => task.destroy());
    console.log('Reminder scheduler stopped');
};

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 */
