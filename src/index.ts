import cors from "cors";
import express from "express";
import router from "./routers/router";

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

const PORT: number = 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
