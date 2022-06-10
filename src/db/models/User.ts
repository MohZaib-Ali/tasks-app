import { Model, model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TaskModel from "./Task";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email.");
      }
    },
  },
  age: {
    type: Number,
    validate: (value: number) => {
      if (value < 18) {
        throw new Error("User over age 18 are allowed");
      }
    },
  },
  password: {
    type: String,
    minlength: 7,
    trim: true,
    validate: (value: string) => {
      if (value.includes("password")) {
        throw new Error("Use another password, It's not secure.");
      }
    },
  },
  token: {
    type: String,
  },
  avatar: {
    type: Buffer,
  }
}, {
  timestamps: true
});

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.token;
  delete user.password;
  delete user.avatar;
  return user
}

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Unable to login...");
  }
  const isMatch = await bcrypt.compare(password, (user as any).password);
  if (!isMatch) {
    throw new Error("Unable to login...");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  await TaskModel.deleteMany({owner: this._id})
  next();
});

userSchema.methods.getToken = function async() {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, {
    expiresIn: "5d",
  });
  this.token = token;
  this.save();
  return token;
};

export interface UserDocument extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
  token: [string];
  tasks: [];
  avatar: Buffer;
  _doc?: any;
}

interface UserDocModel extends UserDocument {
  getToken(): () => {};
}

interface UserModelInterface extends Model<UserDocModel> {
  findByCredentials(email: string, password: string): UserDocModel;
}

const UserModel = model<UserDocModel, UserModelInterface>("User", userSchema);
export default UserModel;
