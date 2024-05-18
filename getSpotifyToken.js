import { PythonShell } from 'python-shell';

PythonShell.run('spottoken.py', null, function (err) {
  if (err) throw err;
  console.log('Spotify token retrieved successfully.');
});