import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  },
});

export default sessionConfig;
