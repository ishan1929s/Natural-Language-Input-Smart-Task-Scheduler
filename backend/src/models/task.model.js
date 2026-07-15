import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
    {
        title : {
            type : String ,
            required : true,
            trim : true,
            index : true,
            maxLength : 50,
        },
        description : {
            type : String ,
            required : true,    
            trim : true,
            maxLength : 1000, 
            index : true,
        },
        status : {
            type : String, 
            enum : ['pending' , 'completed'],
            default : 'pending',
            required : true,
            index : true
        },
        priority : {
            type : String,
            enum : ['low' , 'medium' , 'high', 'urgent'],
            default : 'medium',
            required : true,
            index : true
        },

        deadline : {
            type : Date ,
            default : null ,
        },
        owner :{ 
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
            index : true,
        },
        recurring : {
            type : Boolean,
            default : false,
            index : true,
        },
        natural_language_input : {
            type : String,
            default : null,
            trim : true,
        },
        auto_categorized : {
            type : Boolean,
            default : false,
        },
        smart_suggestions : {
            type : [String],
            default : [],
        },
        dependencies : {
            type : [Schema.Types.ObjectId],
            ref : "Task",
            default : [],
        },
        parent_task_id : {
            type : Schema.Types.ObjectId,
            ref : "Task",
            default : null,
        },
        occurrence_index : {
            type : Number,
            default : null,
        },
        rrule_string : {
            type : String,
            default : null,
        },
        comments : {
            type : [String],
            default : [],
        },
        category : {
            type : String ,
            default : 'general',
            trim : true,
            index : true,
        },
        archived : {
            type : Boolean ,
            default : false,
        },
        time_required : {
            type : Number , // in minutes
            default : null,
            min: 1,
            max: 10080, // Max 1 week in minutes
        }
    },
    {
        timestamps : true
    }
)

// Indexes for better performance
TaskSchema.index({ owner: 1, status: 1 });
TaskSchema.index({ owner: 1, priority: 1 });
TaskSchema.index({ owner: 1, deadline: 1 });
TaskSchema.index({ owner: 1, category: 1 });
TaskSchema.index({ owner: 1, archived: 1 });
TaskSchema.index({ owner: 1, recurring: 1 });
TaskSchema.index({ parent_task_id: 1 });
TaskSchema.index({ dependencies: 1 });

export const Task = mongoose.model("Task" , TaskSchema);
