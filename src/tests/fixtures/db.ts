import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import TaskModel from "../../db/models/Task";
import UserModel from "../../db/models/User";

export const testId = new Types.ObjectId();
export const testUser = {
  _id: testId,
  name: "Muhammad Shahzaib",
  email: "m.shahzaib@ceative.co.uk",
  password: "12345678",
  age: 26,
  token: jwt.sign({ _id: testId }, process.env.SECRET_KEY!),
};

export const userId1 = new Types.ObjectId();
export const user1 = {
  _id: userId1,
  name: "Muhammad Kamran",
  email: "m.kamran@ceative.co.uk",
  password: "12345678",
  age: 29,
  token: jwt.sign({ _id: userId1 }, process.env.SECRET_KEY!),
};

export const userId2 = new Types.ObjectId();
export const user2 = {
  _id: userId2,
  name: "Muhammad Asif",
  email: "m.asif@ceative.co.uk",
  password: "12345678",
  age: 22,
  token: jwt.sign({ _id: userId2 }, process.env.SECRET_KEY!),
};


export const taskId1 = new Types.ObjectId();
export const task1 = {
  _id: taskId1,
  description: "First task",
  completed: false,
  owner: userId1,
};

export const taskId2 = new Types.ObjectId();
export const task2 = {
  _id: taskId2,
  description: "Second task",
  completed: true,
  owner: userId2,
};

export const taskId3 = new Types.ObjectId();
export const task3 = {
  _id: taskId3,
  description: "Third task",
  completed: false,
  owner: userId1,
};

export const setupTestDB = async () => {
  await UserModel.deleteMany();
  await TaskModel.deleteMany();
  await new UserModel(testUser).save();
  await new UserModel(user1).save();
  await new UserModel(user2).save();
  await new TaskModel(task1).save();
  await new TaskModel(task2).save();
  await new TaskModel(task3).save();

};
