import express from "express"
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import attentionRouter from "./routes/attentionRoute.js"
import uploadRouter from "./routes/upload.js"

import quizRouter from "./routes/quizRoute.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import http from "http";
import { initSocket } from "./socket.js";
import chatRoutes from "./routes/chatRoutes.js";
import aiChatRoute from "./routes/aiChatRoute.js";


import liveRouter from "./routes/liveRoutes.js"; 


dotenv.config()

let port = process.env.PORT
let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)
app.use("/api/attention", attentionRouter)
app.use("/api/divide", uploadRouter)
app.use("/api/quiz", quizRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatai", aiChatRoute);


app.use("/api/live", liveRouter);


app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})


const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
    connectDb();
  console.log(`Server running on port ${port}`);
});