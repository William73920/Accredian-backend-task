import express from "express";
import dotenv from "dotenv";
import refferalsRoutes from "./routes/referrals.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({ success: false, status, message });
});

app.use("/api/referrals", refferalsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello World!",
    data: null,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}!`);
});
