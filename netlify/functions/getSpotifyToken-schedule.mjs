// File: netlify/functions/refreshSpotifyToken-schedule.mjs

// The cron expression to run the function every hour
// Netlify Scheduled Functions use an annotation for the schedule

/**
 * @netlify/function-schedule
 * "0 * * * *"
 */

import { PythonShell } from 'python-shell';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Ensure dotenv config is loaded
dotenv.config({ path: path.resolve('../../.env') });

function runPythonScript() {
  return new Promise((resolve, reject) => {
    PythonShell.run(path.join(process.cwd(), 'netlify/functions/spottoken.py'), null, function (err, result) {
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

export async function handler(event, context) {
  await updateEnvFile();
  return {
    statusCode: 200,
    body: 'Spotify token refreshed successfully.',
  };
}
