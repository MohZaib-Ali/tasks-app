import { Router } from "express";
import TaskModel from "../db/models/Task";
import auth from "../middleware/auth";
const router = Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new TaskModel({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.get("/tasks", auth, async (req, res) => {
  try {
    const { completed, limit, skip, sortBy } = req.query;
    const [key, direction] = sortBy.toString().split(":");
    const sortObj: any = {};
    sortObj[key] = direction === "desc" ? -1 : 1;;
    await req.user.populate({
      path: "tasks",
      match: { ...(!!completed && { completed }) },
      options: {
        ...(!!limit && { limit }),
        ...(!!skip && { skip }),
        ...(!!sortBy && {sort: sortObj}),
      },
    });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await TaskModel.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task does not exist" });
    }
    await task.populate({ path: "owner", select: "-token -password" });

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).send({ error: "Task does not exist" });
    }

    res.status(202).send(task);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      res.status(404).send({ error: "Task does not exist" });
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
