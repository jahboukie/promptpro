import { exec } from 'child_process';

console.log('Starting frontend development server...');
console.log('This will start the Vite development server for the React frontend.');

const process = exec('npx vite', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

process.stdout.on('data', (data) => {
  console.log(data);
});

process.stderr.on('data', (data) => {
  console.error(data);
});

console.log('Frontend server starting...');
console.log('Press Ctrl+C to stop the server.');
