const { execFile } = require('child_process');
const { promisify } = require('util');

const execFilePromise = promisify(execFile);

async function getPythonExecutable() {
    // Check if the NETLIFY environment variable is set, which is true on Netlify
    if (process.env.NETLIFY) {
        return 'python3'; // Netlify uses 'python3'
    } else {
        return 'python'; // Locally use 'python'
    }
}

exports.handler = async function(event, context) {
  try {
    const pythonExecutable = await getPythonExecutable();
    const { stdout } = await execFilePromise(pythonExecutable, ['spottoken.py']);
    const token = stdout.trim();
    console.log("Token retrieved:", token);
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