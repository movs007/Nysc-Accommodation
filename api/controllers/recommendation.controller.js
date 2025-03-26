import { spawn } from 'child_process';
import Preference from '../models/preference.model.js';

export const getRecommendations = async(req, res) => {
   
    const userPreferences = await Preference.findById(req.params.id);

     try{
        const pythonProcess = spawn('python', ['api/recommendation/recommendation.py', JSON.stringify(userPreferences)]);

        pythonProcess.stdout.on('data', (data) => {
        const recommendations = JSON.parse(data.toString()); 
        res.json(recommendations); 
        console.log(`Python script output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
        console.error(`Error in Python script: ${data}`);
        });

        pythonProcess.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
        });
    }catch(error){
        res.status(500).json({ error: error.message }); // Respond with error status
    }
    // Function to execute Python code as subprocess


};