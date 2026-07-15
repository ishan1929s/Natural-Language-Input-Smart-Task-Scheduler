import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { sendReminderEmail, sendBulkReminders } from './email.service.js';

// Check for upcoming deadlines and send reminders
export const checkUpcomingDeadlines = async () => {
    try {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        // Find tasks with deadlines in the next 2 hours
        const urgentTasks = await Task.find({
            deadline: {
                $gte: now,
                $lte: twoHoursFromNow
            },
            status: 'pending',
            archived: false
        }).populate('owner', 'email username emailConfig');
        
        // Find tasks with deadlines in the next 24 hours
        const upcomingTasks = await Task.find({
            deadline: {
                $gte: twoHoursFromNow,
                $lte: oneDayFromNow
            },
            status: 'pending',
            archived: false
        }).populate('owner', 'email username emailConfig');
        
        const reminders = [];
        
        // Process urgent tasks (next 2 hours)
        for (const task of urgentTasks) {
            if (task.owner && task.owner.email && task.owner.emailConfig && task.owner.emailConfig.user) {
                reminders.push({
                    userEmail: task.owner.email,
                    task: task,
                    type: 'deadline',
                    urgency: 'urgent',
                    emailConfig: task.owner.emailConfig
                });
            }
        }
        
        // Process upcoming tasks (next 24 hours)
        for (const task of upcomingTasks) {
            if (task.owner && task.owner.email && task.owner.emailConfig && task.owner.emailConfig.user) {
                reminders.push({
                    userEmail: task.owner.email,
                    task: task,
                    type: 'deadline',
                    urgency: 'upcoming',
                    emailConfig: task.owner.emailConfig
                });
            }
        }
        
        // Send all reminders
        if (reminders.length > 0) {
            const results = await sendBulkReminders(reminders);
            console.log(`Sent ${results.length} deadline reminders`);
            return results;
        }
        
        return [];
        
    } catch (error) {
        console.error('Error checking upcoming deadlines:', error);
        return [];
    }
};

// Check for overdue tasks
export const checkOverdueTasks = async () => {
    try {
        const now = new Date();
        
        // Find overdue tasks
        const overdueTasks = await Task.find({
            deadline: {
                $lt: now
            },
            status: 'pending',
            archived: false
        }).populate('owner', 'email username emailConfig');
        
        const reminders = [];
        
        for (const task of overdueTasks) {
            if (task.owner && task.owner.email && task.owner.emailConfig && task.owner.emailConfig.user) {
                reminders.push({
                    userEmail: task.owner.email,
                    task: task,
                    type: 'overdue',
                    emailConfig: task.owner.emailConfig
                });
            }
        }
        
        // Send overdue reminders
        if (reminders.length > 0) {
            const results = await sendBulkReminders(reminders);
            console.log(`Sent ${results.length} overdue reminders`);
            return results;
        }
        
        return [];
        
    } catch (error) {
        console.error('Error checking overdue tasks:', error);
        return [];
    }
};

// Get reminder statistics
export const getReminderStats = async (userId) => {
    try {
        const now = new Date();
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const upcomingTasks = await Task.countDocuments({
            owner: userId,
            deadline: {
                $gte: now,
                $lte: oneDayFromNow
            },
            status: 'pending',
            archived: false
        });
        
        const overdueTasks = await Task.countDocuments({
            owner: userId,
            deadline: {
                $lt: now
            },
            status: 'pending',
            archived: false
        });
        
        const urgentTasks = await Task.countDocuments({
            owner: userId,
            deadline: {
                $gte: now,
                $lte: new Date(now.getTime() + 2 * 60 * 60 * 1000)
            },
            status: 'pending',
            archived: false
        });
        
        return {
            upcoming: upcomingTasks,
            overdue: overdueTasks,
            urgent: urgentTasks,
            total: upcomingTasks + overdueTasks
        };
        
    } catch (error) {
        console.error('Error getting reminder stats:', error);
        return { upcoming: 0, overdue: 0, urgent: 0, total: 0 };
    }
};

// Schedule reminder for specific task
export const scheduleTaskReminder = async (taskId, reminderTime) => {
    try {
        const task = await Task.findById(taskId).populate('owner', 'email username');
        
        if (!task || !task.owner || !task.owner.email) {
            throw new Error('Task or user not found');
        }
        
        // Calculate time until reminder
        const now = new Date();
        const timeUntilReminder = reminderTime - now;
        
        if (timeUntilReminder <= 0) {
            throw new Error('Reminder time must be in the future');
        }
        
        // Schedule the reminder (in a real app, you'd use a job queue like Bull or Agenda)
        setTimeout(async () => {
            await sendReminderEmail(task.owner.email, task, 'deadline');
        }, timeUntilReminder);  
        
        console.log(`Reminder scheduled for task ${taskId} at ${reminderTime}`);
        return { success: true, scheduledFor: reminderTime };
        
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        return { success: false, error: error.message };
    }
};
