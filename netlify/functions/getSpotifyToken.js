import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Correctly get __filename and __dirname
let __filename;
let __dirname;

if (typeof fileURLToPath === 'function') {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} else {
  // Fallback for environments where fileURLToPath is not available
  __filename = __filename || process.cwd();
  __dirname = __dirname || process.cwd();
}

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
