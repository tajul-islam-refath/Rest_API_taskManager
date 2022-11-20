const mongoose = require("mongoose");

const connectDatabase = () => {
  const url = "mongodb://localhost:27017/task_manager";
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
