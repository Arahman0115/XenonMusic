import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure dotenv config is loaded
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function runPythonScript() {
  return new Promise((resolve, reject) => {
    PythonShell.run(path.join(__dirname, 'spottoken.py'), null, function (err, result) {
      if (err) {
        return reject(err);
      }
      const token = result ? result[0].trim() : null;
      resolve(token);
    });
  });
}

async function updateEnvFile() {
  try {
    const token = await runPythonScript();
    if (token) {
      const envFilePath = path.join(__dirname, '../../.env');
      const envContent = fs.readFileSync(envFilePath, 'utf8');
      const newEnvContent = envContent.replace(/VITE_SPOTIFY_TOKEN=.*/, `VITE_SPOTIFY_TOKEN=${token}`);
      fs.writeFileSync(envFilePath, newEnvContent);
      console.log('Spotify token updated successfully.');
    } else {
      console.error('Failed to retrieve Spotify token.');
    }
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

updateEnvFile();
