const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./src/database/database.js");

dotenv.config({ path: "./.env" });

app.listen(process.env.PORT, () => {
  connectDatabase();
  console.log("server is running on port " + process.env.PORT);
});
