import * as chrono from 'chrono-node';
import pkg from 'rrule';
const { RRule } = pkg;
import natural from 'natural';
import { categoryTrainingData, priorityTrainingData, durationPatterns, recurrencePatterns } from './training_data.js';

// Initialize classifiers
const categoryClassifier = new natural.BayesClassifier();
const priorityClassifier = new natural.BayesClassifier();

// Train classifiers with comprehensive data
categoryTrainingData.forEach(item => {
    categoryClassifier.addDocument(item.text, item.category);
});
categoryClassifier.train();

priorityTrainingData.forEach(item => {
    priorityClassifier.addDocument(item.text, item.priority);
});
priorityClassifier.train();

export const parse = async (text, options = {}) => {
    const {
        userId,
        timezone = 'UTC',
        locale = 'en',
        defaultDuration = 60
    } = options;

    let title = '';
    let description = '';
    let deadline = null;
    let time_required = null;
    let priority = 'medium';
    let category = 'general';
    let recurrenceRule = null;
    let confidence = 0;

    try {
        // Extract dates using chrono
        const chronoResult = chrono.parse(text);
        if (chronoResult.length > 0) {
            // Intelligent deadline detection - look for deadline keywords
            const deadlineKeywords = [
                'deadline', 'due', 'submit by', 'submit', 'by', 'until', 'before', 
                'expires', 'expire', 'end', 'finish by', 'complete by', 'deliver by',
                'hand in', 'turn in', 'due date', 'deadline is', 'due on', 'submit on'
            ];
            
            let foundDeadline = false;
            let deadlineDate = null;
            let maxConfidence = 0;
            
            // First, look for explicit deadline keywords
            for (const dateResult of chronoResult) {
                const dateText = dateResult.text.toLowerCase();
                const contextBefore = text.substring(Math.max(0, dateResult.index - 50), dateResult.index).toLowerCase();
                const contextAfter = text.substring(dateResult.index, Math.min(text.length, dateResult.index + 50)).toLowerCase();
                const fullContext = contextBefore + ' ' + dateText + ' ' + contextAfter;
                
                // Check if this date is associated with deadline keywords
                for (const keyword of deadlineKeywords) {
                    if (fullContext.includes(keyword)) {
                        deadlineDate = dateResult.start.date();
                        maxConfidence = Math.max(maxConfidence, 0.8); // High confidence for explicit deadline
                        foundDeadline = true;
                        break;
                    }
                }
            }
            
            // If no explicit deadline found, look for temporal indicators
            if (!foundDeadline) {
                for (const dateResult of chronoResult) {
                    const dateText = dateResult.text.toLowerCase();
                    const contextBefore = text.substring(Math.max(0, dateResult.index - 30), dateResult.index).toLowerCase();
                    const contextAfter = text.substring(dateResult.index, Math.min(text.length, dateResult.index + 30)).toLowerCase();
                    const fullContext = contextBefore + ' ' + dateText + ' ' + contextAfter;
                    
                    // Look for temporal indicators that suggest this is a deadline
                    const temporalIndicators = [
                        'on', 'at', 'for', 'meeting on', 'call on', 'presentation on',
                        'review on', 'check on', 'follow up on', 'remind on'
                    ];
                    
                    for (const indicator of temporalIndicators) {
                        if (fullContext.includes(indicator)) {
                            deadlineDate = dateResult.start.date();
                            maxConfidence = Math.max(maxConfidence, 0.6); // Medium confidence for temporal indicators
                            foundDeadline = true;
                            break;
                        }
                    }
                }
            }
            
            // If still no deadline found, use the last date mentioned (often the actual deadline)
            if (!foundDeadline && chronoResult.length > 0) {
                // Sort dates by position in text (last mentioned is often the deadline)
                const sortedDates = chronoResult.sort((a, b) => b.index - a.index);
                deadlineDate = sortedDates[0].start.date();
                maxConfidence = 0.4; // Lower confidence for fallback
            }
            
            if (deadlineDate) {
                deadline = deadlineDate;
                confidence += maxConfidence;
            }
        }

        // Extract duration using comprehensive patterns
        for (const { pattern, multiplier, range } of durationPatterns) {
            const match = text.match(pattern);
            if (match) {
                if (range && match.length > 2) {
                    // Handle ranges like "2-4 hours"
                    const start = parseInt(match[1]) || 1;
                    const end = parseInt(match[2]) || 1;
                    time_required = ((start + end) / 2) * multiplier;
                } else {
                    const value = parseInt(match[1]) || 1;
                    time_required = value * multiplier;
                }
                confidence += 0.2;
                break;
            }
        }

        if (!time_required) {
            time_required = defaultDuration;
        }

        // Extract priority using enhanced classifier
        const priorityResult = priorityClassifier.classify(text);
        if (priorityResult !== 'medium') {
            priority = priorityResult;
            confidence += 0.2;
        }

        // Extract category using enhanced classifier
        const categoryResult = categoryClassifier.classify(text);
        if (categoryResult !== 'general') {
            category = categoryResult;
            confidence += 0.2;
        }

        // Enhanced title and description extraction
        const words = text.split(' ');
        
        // Remove common stop words and time expressions
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'under', 'over', 'around', 'near', 'far', 'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who', 'which', 'that', 'this', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'tomorrow', 'today', 'yesterday', 'next', 'last', 'this', 'every', 'each', 'all', 'some', 'any', 'no', 'not', 'very', 'quite', 'rather', 'too', 'so', 'such', 'more', 'most', 'less', 'least', 'much', 'many', 'few', 'little', 'big', 'small', 'good', 'bad', 'new', 'old', 'first', 'last', 'next', 'previous', 'other', 'another', 'same', 'different', 'important', 'urgent', 'critical', 'high', 'low', 'medium'];
        
        // Find the main subject/action (usually first meaningful words)
        let titleWords = [];
        let descriptionWords = [];
        let foundSubject = false;
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase().replace(/[^\w]/g, '');
            
            // Skip stop words for title extraction
            if (!foundSubject && stopWords.includes(word)) {
                continue;
            }
            
            // If we haven't found the subject yet, this could be it
            if (!foundSubject) {
                titleWords.push(words[i]);
                foundSubject = true;
                
                // Continue adding words to title until we hit a time/date indicator or stop word
                for (let j = i + 1; j < words.length; j++) {
                    const nextWord = words[j].toLowerCase().replace('/[^\w]/g, ');
                    
                    // Stop if we hit time indicators
                    if (['tomorrow', 'today', 'yesterday', 'next', 'last', 'at', 'on', 'in', 'for', 'until', 'by', 'before', 'after'].includes(nextWord)) {
                        break;
                    }
                    
                    // Stop if we hit stop words (but allow some flexibility)
                    if (stopWords.includes(nextWord) && j > i + 2) {
                        break;
                    }
                    
                    titleWords.push(words[j]);
                    
                    // Limit title to reasonable length
                    if (titleWords.length >= 6) {
                        break;
                    }
                }
                
                // The rest goes to description
                descriptionWords = words.slice(i + titleWords.length);
                break;
            }
        }
        
        // Fallback: if no meaningful title found, use first few words
        if (titleWords.length === 0) {
            titleWords = words.slice(0, Math.min(4, words.length));
            descriptionWords = words.slice(4);
        }
        
        // Clean up and format
        title = titleWords.join(' ').trim();
        description = descriptionWords.join(' ').trim();
        
        // Remove extra whitespace and clean up
        title = title.replace(/\s+/g, ' ').trim();
        description = description.replace(/\s+/g, ' ').trim();
        
        // If description is empty, use the original text
        if (!description) {
            description = text;
        }
        
        // Boost confidence for better title extraction
        if (title.length > 0 && title.length < 50) {
            confidence += 0.4; // Increased from 0.3
        }
        
        // Additional confidence for meaningful titles
        if (title.length > 3 && !stopWords.includes(title.toLowerCase())) {
            confidence += 0.1;
        }

        // Extract recurrence using comprehensive patterns
        for (const { pattern, freq, interval, byweekday, bymonth, bymonthday, bysetpos, byhour } of recurrencePatterns) {
            if (pattern.test(text)) {
                const rruleOptions = {
                    freq: freq,
                    interval: interval === 'dynamic' ? 1 : interval
                };
                
                if (byweekday) rruleOptions.byweekday = byweekday;
                if (bymonth) rruleOptions.bymonth = bymonth;
                if (bymonthday) rruleOptions.bymonthday = bymonthday;
                if (bysetpos) rruleOptions.bysetpos = bysetpos;
                if (byhour) rruleOptions.byhour = byhour;
                
                const rrule = new RRule(rruleOptions);
                recurrenceRule = rrule.toString();
                confidence += 0.1;
                break;
            }
        }

        // Normalize confidence to 0-1
        confidence = Math.min(confidence, 1);

    } catch (error) {
        console.error('NLP parsing error:', error);
        confidence = 0.1;
    }

    return {
        title: title || 'Untitled Task',
        description: description || text,
        deadline,
        time_required,
        priority,
        category,
        recurrenceRule,
        natural_language_input: text,
        confidence
    };
};

export const parseRecurrence = (text) => {
    for (const { pattern, freq, interval, byweekday, bymonth, bymonthday, bysetpos, byhour } of recurrencePatterns) {
        const match = text.match(pattern);
        if (match) {
            const rruleOptions = {
                freq: freq,
                interval: interval === 'dynamic' ? 1 : interval
            };
            
            if (byweekday) rruleOptions.byweekday = byweekday;
            if (bymonth) rruleOptions.bymonth = bymonth;
            if (bymonthday) rruleOptions.bymonthday = bymonthday;
            if (bysetpos) rruleOptions.bysetpos = bysetpos;
            if (byhour) rruleOptions.byhour = byhour;
            
            const rrule = new RRule(rruleOptions);
            return {
                rrule: rrule.toString(),
                frequency: freq,
                interval: interval === 'dynamic' ? 1 : interval
            };
        }
    }
    return null;
};

export const categorize = (text) => {
    const category = categoryClassifier.classify(text);
    const confidence = categoryClassifier.getClassifications(text)
        .find(c => c.label === category)?.value || 0;
    
    return { category, confidence };
};

export const extractDuration = (text) => {
    for (const { pattern, multiplier, range } of durationPatterns) {
        const match = text.match(pattern);
        if (match) {
            if (range && match.length > 2) {
                // Handle ranges like "2-4 hours"
                const start = parseInt(match[1]) || 1;
                const end = parseInt(match[2]) || 1;
                return ((start + end) / 2) * multiplier;
            } else {
                const value = parseInt(match[1]) || 1;
                return value * multiplier;
            }
        }
    }
    return null;
};

export const suggestSlots = async (userId, duration, window = 7) => {
    const { Task } = await import('../models/task.model.js');
    
    const now = new Date();
    const suggestions = [];
    const workingHours = { start: 9, end: 17 }; // 9 AM to 5 PM
    const bufferMinutes = 15; // 15 min buffer between tasks
    
    // Get existing tasks for the user
    const existingTasks = await Task.find({
        owner: userId,
        archived: false,
        deadline: { $gte: now }
    }).sort({ deadline: 1 });
    
    // Generate suggestions for next 7 days
    for (let day = 0; day < window; day++) {
        const currentDate = new Date(now);
        currentDate.setDate(currentDate.getDate() + day);
        
        // Skip weekends (optional)
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
        
        // Find free slots for this day
        const dayStart = new Date(currentDate);
        dayStart.setHours(workingHours.start, 0, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(workingHours.end, 0, 0, 0);
        
        // Get tasks for this day
        const dayTasks = existingTasks.filter(task => {
            if (!task.deadline) return false;
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === currentDate.toDateString();
        });
        
        // Find free time slots
        let currentTime = new Date(dayStart);
        
        while (currentTime < dayEnd) {
            const slotEnd = new Date(currentTime.getTime() + duration * 60000);
            
            // Check if this slot conflicts with existing tasks
            const hasConflict = dayTasks.some(task => {
                if (!task.deadline || !task.time_required) return false;
                
                const taskStart = new Date(task.deadline);
                const taskEnd = new Date(taskStart.getTime() + (task.time_required || 60) * 60000);
                
                // Check for overlap
                return (currentTime < taskEnd && slotEnd > taskStart);
            });
            
            if (!hasConflict && slotEnd <= dayEnd) {
                suggestions.push({
                    start: currentTime.toISOString(),
                    end: slotEnd.toISOString(),
                    duration,
                    confidence: 0.8 - (day * 0.1) // Higher confidence for sooner dates
                });
            }
            
            // Move to next potential slot (every 30 minutes)
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
    }
    
    // Sort by confidence and return top 3
    return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);
};

export const detectConflicts = async (userId, start, duration) => {
    const { Task } = await import('../models/task.model.js');
    
    const startTime = new Date(start);
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    // Find tasks that overlap with the proposed time slot
    const conflictingTasks = await Task.find({
        owner: userId,
        archived: false,
        deadline: { $exists: true, $ne: null },
        time_required: { $exists: true, $ne: null },
        $or: [
            // Task starts before our end and ends after our start
            {
                deadline: { $lt: endTime },
                $expr: {
                    $gt: [
                        { $add: ["$deadline", { $multiply: ["$time_required", 60000] }] },
                        startTime
                    ]
                }
            }
        ]
    });
    
    return conflictingTasks.map(task => ({
        taskId: task._id,
        title: task.title,
        start: task.deadline,
        end: new Date(task.deadline.getTime() + (task.time_required || 60) * 60000),
        duration: task.time_required || 60,
        priority: task.priority
    }));
};

// Recurring task management functions
export const generateRecurringTasks = async (userId, taskData, rruleString, endDate) => {
    const { Task } = await import('../models/task.model.js');
    
    try {
        const rrule = RRule.fromString(rruleString);
        const startDate = new Date(taskData.deadline);
        const until = endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year default
        
        // Generate occurrences
        const occurrences = rrule.between(startDate, until, true);
        
        const recurringTasks = [];
        
        for (let i = 0; i < occurrences.length; i++) {
            const occurrence = occurrences[i];
            
            const task = await Task.create({
                ...taskData,
                deadline: occurrence,
                recurring: true,
                parent_task_id: taskData._id || null,
                occurrence_index: i,
                owner: userId
            });
            
            recurringTasks.push(task);
        }
        
        return recurringTasks;
    } catch (error) {
        console.error('Error generating recurring tasks:', error);
        throw new Error('Failed to generate recurring tasks');
    }
};

export const updateRecurringSeries = async (taskId, updates) => {
    const { Task } = await import('../models/task.model.js');
    
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    
    if (!task.recurring) {
        // Update single task
        return await Task.findByIdAndUpdate(taskId, updates, { new: true });
    }
    
    // Update all tasks in the recurring series
    const seriesTasks = await Task.find({
        $or: [
            { _id: taskId },
            { parent_task_id: taskId },
            { parent_task_id: task.parent_task_id }
        ]
    });
    
    const updatedTasks = [];
    for (const seriesTask of seriesTasks) {
        const updated = await Task.findByIdAndUpdate(seriesTask._id, updates, { new: true });
        updatedTasks.push(updated);
    }
    
    return updatedTasks;
};

export const deleteRecurringSeries = async (taskId, deleteType = 'this') => {
    const { Task } = await import('../models/task.model.js');
    
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    
    if (deleteType === 'this') {
        // Delete only this occurrence
        return await Task.findByIdAndDelete(taskId);
    } else if (deleteType === 'following') {
        // Delete this and all future occurrences
        const futureTasks = await Task.find({
            $or: [
                { _id: taskId },
                { parent_task_id: task.parent_task_id, occurrence_index: { $gte: task.occurrence_index } }
            ]
        });
        
        return await Task.deleteMany({ _id: { $in: futureTasks.map(t => t._id) } });
    } else if (deleteType === 'all') {
        // Delete entire series
        const seriesTasks = await Task.find({
            $or: [
                { _id: taskId },
                { parent_task_id: taskId },
                { parent_task_id: task.parent_task_id }
            ]
        });
        
        return await Task.deleteMany({ _id: { $in: seriesTasks.map(t => t._id) } });
    }
};

export const getDailySlotsAndConflicts = async (userId, window = 7, slotDuration = 30) => {
    const { Task } = await import('../models/task.model.js');
    const now = new Date();
    const workingHours = { start: 9, end: 17 };

    // Fetch upcoming tasks
    const existingTasks = await Task.find({
        owner: userId,
        archived: false,
        deadline: { $gte: now },
        time_required: { $exists: true, $ne: null }
    }).sort({ deadline: 1 });

    const results = [];

    for (let day = 0; day < window; day++) {
        const currentDate = new Date(now);
        currentDate.setDate(currentDate.getDate() + day);

        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

        const dayStart = new Date(currentDate);
        dayStart.setHours(workingHours.start, 0, 0, 0);

        const dayEnd = new Date(currentDate);
        dayEnd.setHours(workingHours.end, 0, 0, 0);

        // Tasks on this day
        const dayTasks = existingTasks.filter(task => {
            const taskDate = new Date(task.deadline);
            return taskDate.toDateString() === currentDate.toDateString();
        });

        // Prepare free slots
        const freeSlots = [];
        let currentTime = new Date(dayStart);

        while (currentTime < dayEnd) {
            const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

            // Check conflict
            const overlappingTasks = dayTasks.filter(task => {
                const taskStart = new Date(task.deadline);
                const taskEnd = new Date(taskStart.getTime() + task.time_required * 60000);
                return currentTime < taskEnd && slotEnd > taskStart;
            });

            if (overlappingTasks.length === 0 && slotEnd <= dayEnd) {
                freeSlots.push({
                    start: currentTime.toISOString(),
                    end: slotEnd.toISOString(),
                    duration: slotDuration
                });
            }

            currentTime.setMinutes(currentTime.getMinutes() + 30); // next slot
        }

        results.push({
            date: currentDate.toDateString(),
            freeSlots,
            overlappingTasks: dayTasks.map(task => ({
                taskId: task._id,
                title: task.title,
                start: task.deadline,
                end: new Date(task.deadline.getTime() + task.time_required * 60000),
                duration: task.time_required,
                priority: task.priority
            }))
        });
    }

    return results;
};
