const express = require('express');

const router = express.Router();

const problemService = require('../services/problemService');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').Client;

const restClient = new nodeRestClient();

EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST')

router.get('/problems', function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// Get one problem given an id
router.get('/problems/:id', function(req, res) {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

// Post problem
router.post('/problems', jsonParser, function(req, res) {
	problemService.addProblem(req.body)
		.then(problem => {
			res.json(problem);
		}, (error) => {
			res.status(400).send('Problem name already exists!');
		});
});

router.post('/build_and_run', jsonParser, (req, res) => {
	const code = req.body.code;
	const lang = req.body.lang;

	console.log('lang: ', lang, 'user code: ', code);

	restClient.methods.build_and_run(
		{
			data: {code: code, lang: lang},
			headers: {'Content-Type': 'application/json'}
		},
		(data, response) => {
			const text = `Build output: ${data['build']}, execute output: ${data['run']}`;
			console.log(text);
			res.json(text);
		}
	)
});

// Update problem 
router.put('/problems', jsonParser, (req,res) => {
	problemService.modifyProblem(req.body)
		.then(problem => {
			res.json(problem);
		}, (error) => {
			res.status(400).send('Failed to update probelm!');
		});
})

module.exports = router;
