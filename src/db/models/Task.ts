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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const TaskModel = model('Task', taskSchema);

export default TaskModel;