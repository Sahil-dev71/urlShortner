import express from "express";
import userRouter from "./routes/user.routes.js"
import {userAuthentication} from "./middlewares/auth.middlewares.js";
import urlRouter from "./routes/url.routes.js";
const app=express();
const PORT= process.env.PORT??8000;
app.use(express.json());
app.get("/",(req,res)=>{
    return res.json({
        message:"server is up and running",
    })
})
app.use("/user",userRouter);
app.use(userAuthentication);
app.use(urlRouter);
app.listen(PORT,()=>{
    console.log(`server is up and running on PORT : ${PORT}`);
})