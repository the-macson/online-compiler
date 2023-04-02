const { spawn, exec } = require("child_process");
const fs = require("fs");

const runCppCode = (req, res) => {
    const input = req.body.input;
    const testcase = req.body.testCase;
    fs.writeFileSync("code.cpp", req.body.code);
    const fileCompilePromise = new Promise((resolve, reject) => {
        exec("g++ code.cpp -o code", (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
            } else {
                resolve(stdout);
            }
        });
    });

    // if fileCompilePromise is resolved then execute chmod command
    const filePermissionPromise = fileCompilePromise.then(() => {
        return new Promise((resolve, reject) => {
            exec("chmod +x code", (error, stdout, stderr) => {
                if (error || stderr) {
                    reject(error || stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    });

    // if filePermissionPromise is resolved then execute code command
    let allPromises = [];
    let codeExecutionPromise;
    let numPassed = 0;
    filePermissionPromise
        .then(() => {
            for(let i = 0; i < testcase.length; i++) {
                codeExecutionPromise =  new Promise((resolve, reject) => {
                    const child = spawn("./code", [], {
                        stdio: ["pipe", "pipe", "pipe"],
                    });
                    child.stdin.write(testcase[i].input);
                    child.stdin.end();
                    let output = "";
                    child.stdout.on("data", (data) => {
                        output += data.toString();
                    });
                    child.stderr.on("data", (data) => {
                        output += data.toString();
                    });
                    child.on("close", (code) => {
                        if (code !== 0) {
                            console.log(`child process exited with code ${code}`);
                            reject(`child process exited with code ${code}`);
                        } else {
                            if(output === testcase[i].output) {
                                numPassed++;
                            }
                            resolve(numPassed);
                        }
                    });
                });
                allPromises.push(codeExecutionPromise);
                console.log(allPromises);
            } 
            return Promise.all(allPromises);
        }).then((output) => {
            console.log(output);
            console.log("total passed: ", numPassed);
            res.status(200).send({numPassed});
        })
        .catch((error) => {
            console.log(error);
            res.status(401).send(error);
        });
};
module.exports = { runCppCode };