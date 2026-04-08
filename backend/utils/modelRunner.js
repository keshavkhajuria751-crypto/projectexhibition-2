const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs the Python ML Predictor script.
 * @param {string} url - The product URL to analyze.
 * @returns {Promise<object>} - The parsed prediction result from Python.
 */
const runMlPredictor = (url) => {
  return new Promise((resolve, reject) => {
    // Path to the Python script
    const scriptPath = path.join(__dirname, '../../model/predictor.py');
    
    // Spawn the python process
    const pythonProcess = spawn('python', [scriptPath, url]);

    let result = '';
    let errorOutput = '';

    // Capture stdout (standard output)
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture stderr (standard error output)
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python Script Error Output:', errorOutput);
        return reject(new Error(`Python process exited with code ${code}. Error: ${errorOutput}`));
      }

      try {
        const parsedResult = JSON.parse(result);
        resolve(parsedResult);
      } catch (err) {
        console.error('Could not parse Python output:', result);
        reject(new Error('Failed to parse prediction result.'));
      }
    });

    // Handle initial process spawn errors
    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

module.exports = { runMlPredictor };
