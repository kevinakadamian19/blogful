const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeArticlesArray } = require('./articles.fixtures')

    let db;

    before('make knex instance', () => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('blogful_articles').truncate())

    afterEach('Clean up', () => db('blogful_articles').truncate())

    describe(`GET /articles`, () => {
        context('Given there are no articles in the database', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/articles')
                    .expect(200, [])
            })
        })

        context(`Given there are articles in the database`, () => {
            const testArticles = makeArticlesArray();
            
            beforeEach('insert articles', () => {
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })
            it('responds with 200 and all of the articles', () => {
                return supertest(app)
                    .get('/articles')
                    .expect(200, testArticles)
            })
        })
    })

    describe('GET /articles/:article_id', () => {
        context(`Given there are no articles in the database`, () => {
            it('responds with a 404 error stating not found', () => {
                const articleId = 123456
                return supertest(app)
                    .get(`/articles/${articleId}`)
                    .expect(404, {error: {message: `Article doesn't exist`}})
            })
        })

        context(`Given there are articles in the database`, () => {
            const testArticles = makeArticlesArray();
            
            beforeEach('insert articles', () => {
                return db
                    .into('blogful_articles')
                    .insert(testArticles)
            })
        it('Responds with 200 and the specific article', () => {
            const articleId = 2
            const expectedArticle = testArticles[articleId-1]
            return supertest(app)
                .get(`/articles/${articleId}`)
                .expect(200, expectedArticle)
            })
        })
    })