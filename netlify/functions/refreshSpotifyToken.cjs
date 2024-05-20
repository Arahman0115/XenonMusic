const { execFile } = require('child_process');
const { promisify } = require('util');

const execFilePromise = promisify(execFile);

exports.handler = async function(event, context) {
  try {
    const { stdout } = await execFilePromise('python', ['spottoken.py']);
    const token = stdout.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error('Error retrieving Spotify token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve Spotify token' }),
    };
  }
}