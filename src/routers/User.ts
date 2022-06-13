import { Request, Response, Router } from "express";
import multer, { diskStorage } from "multer";
import UserModel from "../db/models/User";
import auth from "../middleware/auth";
import sharp from "sharp";
import { sendWelcomeEmail, sendByeByeEmail } from "../utils/mailer";

const router = Router();

// const storage = diskStorage({
//   destination: "avatars",
//   filename: (req: Request, fil: Response, callback) => {
//     callback(null, `${req.user._id}.${file.originalname.split(".")[1]}`);
//   },
// });
const avatarUpload = multer({
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) =>
    !file.originalname.match(/\.(jpg|jpeg|png)$/i)
      ? cb(new Error("Please upload a JPG, JPEG or PNG File."))
      : cb(undefined, true),
});

router.post("/users", async (req: Request, res: Response) => {
  const user = new UserModel(req.body);
  try {
    await user.save();
    await user.getToken();
    const {
      _doc: { token },
    } = user;
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post(
  "/users/avatar",
  auth,
  avatarUpload.single("avatar"),
  async (req: Request, res: Response) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.status(201).send({ message: "Avatar uploaded successfully!" });
    } catch (e) {
      res.status(400).send();
    }
  }
);

router.get("/users/avatar", auth, async (req: Request, res: Response) => {
  if (!req.user.avatar) {
    throw new Error("User avatar not found");
  }
  res.header("Content-Type", "image/png");
  res.send(req.user.avatar);
});

router.get("/users/:id/avatar", async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.avatar) {
    throw new Error("User avatar not found");
  }
  res.header("Content-Type", "image/jpeg");
  res.send(user.avatar);
});

router.post("/users/login", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(404).send({ error: "User does not exist" });
    }
    await user.getToken();
    const {
      _doc: { token },
    } = user;
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req: Request, res: Response) => {
  try {
    if (!req.user.token) {
      return res.status(404).send({ error: "User was not logged in!" });
    }
    await req.user.updateOne({ $unset: { token: 1 } });
    res
      .status(200)
      .send({ message: "User logged out, To continue login again!" });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users", auth, async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", auth, async (req: Request, res: Response) => {
  const _id = req.params.id;

  try {
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(404).send({ error: "User does not exist" });
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/users", auth, async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.status(202).send(req.user);
  } catch (e) {
    res.status(400).send();
  }
});

router.patch("/users/:id", auth, async (req: Request, res: Response) => {
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
      return res.status(404).send({ error: "User does not exist" });
    }

    res.status(202).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

router.delete("/users", auth, async (req: Request, res: Response) => {
  try {
    await req.user.remove();
    sendByeByeEmail(req.user.email, req.user.name);
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/users/:id", auth, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User does not exist" });
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
