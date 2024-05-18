import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Ensure __filename and __dirname are only set once globally
if (typeof globalThis.__filename === 'undefined' || typeof globalThis.__dirname === 'undefined') {
  globalThis.__filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = path.dirname(globalThis.__filename);
}

// Ensure dotenv config is loaded
dotenv.config({ path: path.resolve(globalThis.__dirname, '../../.env') });

function runPythonScript() {
  return new Promise((resolve, reject) => {
    PythonShell.run(path.join(globalThis.__dirname, 'spottoken.py'), null, function (err, result) {
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
