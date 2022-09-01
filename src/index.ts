import cors from "cors";
import express from "express";
import { Request, Response } from "express";

const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Request succesful");
});

const PORT: number = 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
