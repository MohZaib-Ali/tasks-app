import request from "supertest";
import app from "../app";
import TaskModel from "../db/models/Task";
import { setupTestDB, taskId1, testId, testUser, user1, user2, userId2 } from "./fixtures/db";

beforeEach(setupTestDB);

test("Should create a new Task for User", async () => {
  // User Sign up Validate
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({
      description: "Clean shoes",
    })
    .expect(201);

  // DB Object NotNull Check
  const task = await TaskModel.findById(res.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should return all Tasks for User 1", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${user1.token}`)
    .expect(200);

  expect(res.body.length).toEqual(2);
});

test("Task delete Check", async () => {
  const res = await request(app)
    .delete("/tasks/"+ taskId1)
    .set("Authorization", `Bearer ${user2.token}`)
    .expect(404);

  const task = await TaskModel.findById(taskId1);
  expect(task).not.toBeNull();
});
