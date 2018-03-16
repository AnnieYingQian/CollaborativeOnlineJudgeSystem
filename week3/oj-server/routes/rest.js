const express = require('express');
const router = express.Router();

const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').Client;
// for server to call the RESTful API
const restClient = new nodeRestClient();
EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';
// register a method
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');


// get all problems
router.get('/problems', function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// Get one problem based on id
router.get('/problems/:id', (req, res) => {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

// post porblem
router.post('/problems', jsonParser, (req, res) => {
    problemService.addProblem(req.body)
        .then(
            //resolve
            (problems) => {
                res.json(problems);
            },

            // reject
            (error) => {
                res.status(400).send("Problem name already exists");
            }
        )
});

// build and run
// jsonParser: middleware, used to parse the body of the POST request
router.post('/build_and_run', jsonParser, (req, res) => {
    const userCode = req.body.user_code;
    const lang = req.body.lang;
    console.log('lang:', lang, "code:", userCode);

    // this is the method we registered before
    restClient.methods.build_and_run(
        {
        data: {code: userCode, lang: lang},
        headers: {'Content-Type': 'application/json'}
        },
        (data, response) => {
            // response: raw data, data: parsed response
            const text = `Build output: ${data['build']}, execute output: ${data['run']}`;
            console.log(text);
            res.json(text);
        }
    )
})
// export Router
module.exports = router;
