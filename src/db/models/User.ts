import { Model, model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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
      if (value < 0) {
        throw new Error("Invalid age.");
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
});

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

interface UserDocument extends Document {
  name: string;
  email: string;
  age: number;
  password: string;
}

interface UserModelInterface extends Model<UserDocument> {
  findByCredentials(email: string, password: string): any;
}

const UserModel = model<UserDocument, UserModelInterface>("User", userSchema);
export default UserModel;
