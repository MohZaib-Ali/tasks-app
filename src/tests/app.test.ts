import request from "supertest";
import app from "../app";
import UserModel from "../db/models/User";
import { setupTestDB, testId, testUser } from "./fixtures/db";

beforeEach(setupTestDB);

test("Should sign up user", async () => {
  // User Sign up Validate
  const res = await request(app)
    .post("/users")
    .send({
      name: "Muhammad Shahzaib",
      email: "mr.mohzaib.ali@gmail.com",
      password: "12345678",
      age: 26,
    })
    .expect(201);

  // DB Object NotNull Check
  const userRes = await UserModel.findById(res.body.user._id);
  expect(userRes).not.toBeNull();

  // Response Validation
  const { token } = userRes!;
  expect(res.body).toMatchObject({
    user: {
      name: "Muhammad Shahzaib",
      email: "mr.mohzaib.ali@gmail.com",
      age: 26,
    },
    token,
  });

  // Password Encryption
  expect(userRes!.password).not.toBe("12345678");
});

test("Should log in user", async () => {
  await request(app).post("/users/login").send(testUser).expect(200);
});

test("Should not log in user", async () => {
  await request(app)
    .post("/users/login")
    .send({ ...testUser, password: "3456090" })
    .expect(400);
});

test("Should get own profile", async () => {
  await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${testUser.token}`)
    .send(testUser)
    .expect(200);
});

test("Should not get own profile", async () => {
  await request(app).get("/users").send(testUser).expect(401);
});

test("Should upload an avatar", async () => {
  await request(app)
    .post("/users/avatar")
    .set("Authorization", `Bearer ${testUser.token}`)
    .attach("avatar", "src/tests/fixtures/pic.png")
    .expect(201);

  const userRes = await UserModel.findById(testUser._id);
  expect(userRes?.avatar).toEqual(expect.any(Buffer));
});

test("Should update own profile with valid fields", async () => {
  const res = await request(app)
    .patch("/users")
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({name: "Ali"})
    .expect(202);

  // DB Update NotNull Check
  const userRes = await UserModel.findById(res.body._id);
  expect(userRes!.name).toEqual("Ali");
});

test("Should not update own profile with invalid fields", async () => {
  await request(app)
    .patch("/users")
    .set("Authorization", `Bearer ${testUser.token}`)
    .send({location: "Lahore"})
    .expect(400);
});

test("Should delete own profile", async () => {
  const res = await request(app)
    .delete("/users")
    .set("Authorization", `Bearer ${testUser.token}`)
    .send(testUser)
    .expect(200);

  // DB Object Null Check
  const userRes = await UserModel.findById(res.body._id);
  expect(userRes).toBeNull();
});
test("Should not delete own profile", async () => {
  await request(app).delete("/users").send(testUser).expect(401);
});
