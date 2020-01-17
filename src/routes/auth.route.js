import bcrypt from 'bcrypt';
import express from 'express';
import auth from '../middleware/auth';

const router = express.Router();

router.post("/login", async (req, res) => {
  const User = req.app.get('db').user;

  if (!req.body.email) return res.status(400).send('Missing email address');
  if (!req.body.password) return res.status(400).send('Missing password');

  //find an existing user
  let user = await User.findOne({
    where: {
      email: req.body.email
    }
  });

  let valid = await bcrypt.compare(req.body.password, user.password);

  if (!user || !valid) return res.status(400).send("Invalid email/password provided");

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

export default router;
