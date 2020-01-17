import express from 'express';
import auth from '../middleware/auth';
// import { User, validate } from '../models/user.model';

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const Job = req.app.get('db').job;

  const jobs = await Job.findAll();

  res.send(jobs);
});

router.post("/", auth, async (req, res) => {
  const Job = req.app.get('db').job;

  // validate the request body first
  const { error } = Job.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let job = await Job.findOne({
    where: {
      name: req.body.name,
      userId: req.user.id
    }
  });

  if (job) return res.status(400).send("Job already being tracked");

  job = new Job({
    name: req.body.name,
    userId: req.user.id
  });

  await job.save();

  res.send(job.get({ plain: true }));
});

export default router;
