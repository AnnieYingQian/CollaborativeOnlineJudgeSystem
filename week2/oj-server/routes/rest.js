const express = require('express');
const router = express.Router();

const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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

module.exports = router;