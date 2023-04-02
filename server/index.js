const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const CodeExecutionRouter = require('./routes/CodeExecutionRouter');


// middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use(CodeExecutionRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);