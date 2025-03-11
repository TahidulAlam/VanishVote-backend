import express from "express";
import {
  createPoll,
  getSinglePoll,
  reactPoll,
  votePoll,
} from "../controllers/poll.controller.js";

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

router.post("/poll", createPoll);
router.get("/poll/:id", getSinglePoll);
router.post("/poll/:id/vote", votePoll);
router.post("/poll/:id/react", reactPoll);
export default router;
