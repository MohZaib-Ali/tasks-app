import { model, Schema } from "mongoose";

const taskSchema = new Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const TaskModel = model('Task', taskSchema);

export default TaskModel;