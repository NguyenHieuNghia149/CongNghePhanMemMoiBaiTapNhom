import express from 'express';

let router = express.Router();


let routes =  (app) => {
    router.get('/', (req, res) => {
        res.send('Welcome to the API');
    });
}

module.exports = routes;