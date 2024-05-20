const { execFile } = require('child_process');
const { promisify } = require('util');

const execFilePromise = promisify(execFile);

exports.handler = async function(event, context) {
  try {
    console.log("Attempting to execute Python script...");
    const { stdout } = await execFilePromise('python', ['spottoken.py']);
    const token = stdout.trim();
    console.log("Python script executed successfully:", token);
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error("Failed to execute Python script:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve Spotify token", details: error.toString() }),
    };
  }
};