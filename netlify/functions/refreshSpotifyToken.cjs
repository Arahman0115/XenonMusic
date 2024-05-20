const { execFile } = require('child_process');
const { promisify } = require('util');

const execFilePromise = promisify(execFile);

async function getPythonExecutable() {
  // Locally use 'python', on Netlify (or other environments), use 'python3'
  const isNetlify = process.env.NETLIFY; // Netlify sets this environment variable
  return isNetlify ? 'python3' : 'python';
}

exports.handler = async function(event, context) {
  try {
    const pythonExecutable = await getPythonExecutable();
    const { stdout } = await execFilePromise(pythonExecutable, ['spottoken.py']);
    const token = stdout.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error('Error retrieving Spotify token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve Spotify token', details: error.message }),
    };
  }
};