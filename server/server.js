import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import { readdirSync } from "fs";

require("dotenv").config();
const app = express();
const morgan = require("morgan");

// middleware
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// app.use('/api', router);

console.log("Server running...", process.version);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Running on port 3001`);
});
