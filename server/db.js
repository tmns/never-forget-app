import mongoose from "mongoose";
import config from "./config/config";

export const connect = (url = config.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
};
