const mongoose = require("mongoose");

const connectDatabase = () => {
  let dbName = process.env.DB_NAME;
  let dbPass = process.env.DB_PASS;
  const url = `mongodb+srv://${dbName}:${dbPass}@cluster0.ltldm.mongodb.net/task_manager?retryWrites=true&w=majority`;
  const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(url, config, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connect database successfully");
    }
  });
};

module.exports = connectDatabase;
