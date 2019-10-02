require('dotenv').config;
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/articles', (req,res,next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
})

app.get('/articles/:article_id', (req,res,next) => {
    const knexInstance = req.app.get('db')
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
            if(!article) {
                return res.status(404).json({
                    error: {message: `Article doesn't exist`}
                })
            }
            res.json(article)
        })
        .catch()
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error,req,res,next) {
    let response
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server issue'}}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
})

module.exports = app;