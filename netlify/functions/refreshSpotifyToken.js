import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

exports.handler = async function(event, context) {
  return new Promise((resolve, reject) => {
    PythonShell.run(path.join(__dirname, 'spottoken.py'), null, function (err, result) {
      if (err) {
        return reject({
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to retrieve Spotify token', details: err.message }),
        });
      }
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: 'Spotify token retrieved successfully.' }),
      });
    });
  });
};