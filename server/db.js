import mongoose from "mongoose";
import { DB_URI } from "./config/config";

export const connect = (url = DB_URI, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
};
