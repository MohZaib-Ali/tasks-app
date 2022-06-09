import { Router } from "express";
import UserModel from "../db/models/User";
import auth from "../middleware/auth";

const router = Router();

router.post("/users", async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
    const token = await user.getToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({error: e});
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token: string) => token !== req.token);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await UserModel.findById(req.params.id);
    updates.forEach((update) => ((user as any)[update] = req.body[update]));
    await user.save();

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
