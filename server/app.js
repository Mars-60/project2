const express=require("express");
const cors=require("cors");
const passport=require("passport");

require("./config/google");
require("./config/github");

const app=express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth",require("./routes/authRoutes.js"));
app.use("/api/repo",require("./routes/repoRoutes.js"));
app.use("/api/ai", require("./routes/aiRoutes.js"));

module.exports=app;