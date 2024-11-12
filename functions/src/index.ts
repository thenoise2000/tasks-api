import * as functions from "firebase-functions";
import * as express from "express";
import userRoute from "./../../routes/userRoute";
import taskRoute from "./../../routes/taskRoute";

const app = express();

// Routes
app.use("/users", userRoute);
app.use("/tasks", taskRoute);

// Export
export const api = functions.https.onRequest(app);
