import config from 'config';
import express from 'express';
import AuthRoutes from './routes/auth.route';
import UserRoutes from './routes/user.route';
import JobRoutes from './routes/job.route';
import { db } from './database';

const app = express();

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("PRIVATE_KEY")) {
  console.error("FATAL ERROR: PRIVATE_KEY is not defined.");
  process.exit(1);
}

app.set('db', db);
app.use(express.json());
app.use("/api/auth", AuthRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/jobs", JobRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
