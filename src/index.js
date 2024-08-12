import app from "./app.js";
import { PORT } from "./config.js";

app.listen(3000, () => {
  console.log("Server on port " + PORT);
});