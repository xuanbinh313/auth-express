import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import route from './router/route.js'
const app = express()


/** middleware */
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')


const port = 8000

app.get("/", (req, res) => {
    res.status(200).json("Home GET request")
})
app.use("/api",route)
const uri = "mongodb+srv://root:root@cluster0.tj42b.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri).then(()=>{
    app.listen(port, () => console.log(`server runing on port: http://localhost:${port}`))
})

