import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Correctly get __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dotenv config is loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function runPythonScript() {
  return new Promise((resolve, reject) => {
    PythonShell.run(path.join(__dirname, 'spottoken.py'), null, function (err, result) {
      if (err) {
        return reject(err);
      }
      console.log('Python script output:', result); // Log the result
      resolve(result);
    });
  });
}

async function updateEnvFile() {
  try {
    await runPythonScript();
    console.log('Spotify token updated successfully.');
  } catch (error) {
    console.error('Error running Python script:', error);
  }
}

updateEnvFile();
