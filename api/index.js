import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import commentRouter from './routes/comment.route.js';
import preferenceRouter from './routes/preference.route.js';
import recommendationRouter from './routes/recommendation.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
// import { spawn } from 'child_process';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();


  app.use(cors({
    origin: ["http://localhost:5173", "https://nysc-accommodation.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/comment', commentRouter);
app.use('/api/preference', preferenceRouter);
app.use('/api/recommendation', recommendationRouter);


// app.use(express.static(path.join(__dirname, '/client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// })

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// // Function to execute Python code as subprocess
// const pythonProcess = spawn('python', ['api/recommendation/recommendation.py', 'arg1', 'arg2']);

// pythonProcess.stdout.on('data', (data) => {
//   const recommendations = JSON.parse(data.toString()); 
//   res.json(recommendations); 
//   console.log(`Python script output: ${data}`);
// });

// pythonProcess.stderr.on('data', (data) => {
//   console.error(`Error in Python script: ${data}`);
// });

// pythonProcess.on('close', (code) => {
//   console.log(`Python script exited with code ${code}`);
// });

// Example usage of runPythonScript function
// app.get('/run-python-script', async (req, res) => {
//   try {
//     const result = await runPythonScript('recommendation.py', ['arg1', 'arg2']);
//     console.log('Python script executed successfully:', result);
//     res.send('Python script executed successfully');
//   } catch (error) {
//     console.error('Error executing Python script:', error);
//     res.status(500).send('Error executing Python script');
//   }
// });     