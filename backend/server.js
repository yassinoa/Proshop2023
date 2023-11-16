import path from 'path'
import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import ProductRoutes from "./routes/ProductRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cookieParser from "cookie-parser"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
dotenv.config()
const port=process.env.PORT 
connectDB()
const app=express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',ProductRoutes)
app.use('/api/users',UserRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/upload',uploadRoutes)
app.get('/',(req,res)=>{
  res.send('API RUNNING ...') 
})
const __dirname=path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads')))

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>console.log(`Server is running on port ${port}`))