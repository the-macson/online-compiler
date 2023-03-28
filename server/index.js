const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const child_process = require("child_process");
const { spawn } = child_process;
const { exec } = child_process;
const fs = require('fs');
// middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.post('/submit', (req, res) => {
    console.log(req.body);
    const input = req.body.input;
    fs.writeFileSync("code.cpp", req.body.code);

    // execute g++ and chmod commands in parallel
    const promises = [
      new Promise((resolve, reject) => {
        exec("g++ code.cpp -o code", (error, stdout, stderr) => {
          if (error || stderr) {
            reject(error || stderr);
            res.status(403).send(error || stderr);
          } else {
            resolve(stdout);
          }
        });
      }),
      new Promise((resolve, reject) => {
        exec("chmod +x code", (error, stdout, stderr) => {
          if (error || stderr) {
            reject(error || stderr);
          } else {
            resolve(stdout);
          }
        });
      }),
    ];

    // wait for all promises to resolve before executing code1 command
    Promise.all(promises)
      .then(() => {
        const child = spawn("./code", [], {
          stdio: ["pipe", "pipe", "pipe"],
        });
        child.stdin.write(input);
        child.stdin.end();
        let output = "";
        child.stdout.on("data", (data) => {
            output += data.toString();
            console.log(data.toString());
        });
        child.stderr.on("data", (data) => {
            output += data.toString();
            console.log(data.toString());
        });
        child.on("close", (code) => {
            if(code !== 0) {
                console.log(`child process exited with code ${code}`);
                res.status(401).send(`child process exited with code ${code}`);
            }
            else {
                res.status(200).send(output);
                return;
            }
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send(error);
      });
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);