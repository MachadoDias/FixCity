const { execFile } = require('child_process');
const path = require('path');

function runModel(script, text) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '../../classifier', script);

    execFile('python', [pythonScript, text], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Erro no modelo ${script}:`, stderr);
        return reject(err);
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        reject(e);
      }
    });
  });
}


module.exports = {classifyText};
