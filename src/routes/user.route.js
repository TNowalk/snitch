import bcrypt from 'bcrypt';
import express from 'express';
import auth from '../middleware/auth';
// import { User, validate } from '../models/user.model';

const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const User = req.app.get('db').user;

  const user = await User.findByPk(req.user.id, {
    attributes: ['name', 'email', 'isAdmin']
  });

  if (!user) return res.status(400).send('Invalid token provided');

  res.send(user.get({ plain: true }));
});

router.post("/", async (req, res) => {
  const User = req.app.get('db').user;

  // validate the request body first
  const { error } = User.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    isAdmin: false
  });

  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

export default router;
