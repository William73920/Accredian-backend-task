import express from "express";
import {
  addReferral,
  deleteAllReferral,
  getReferrals,
} from "../controllers/referrals.js";

const router = express.Router();

router.post("/", addReferral);

router.get("/", getReferrals);

router.delete("/", deleteAllReferral);

export default router;
