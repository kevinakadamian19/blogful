const ArticlesService = {
    //knex instance where method returns all articles from blogful_articles table
    getAllArticles(knex) {
        return knex.select('*').from('blogful_articles');
    },
    //knexInstance where new article is inserted into blogful_articles table
    insertArticle(knex, newArticle) {
        return knex
            .insert(newArticle)
            .into('blogful_articles')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    //knexInstance where we get specific article by id
    getById(knex,id) {
        return knex.from('blogful_articles').select('*').where('id',id).first()
    },
    deleteArticle(knex,id) {
        return knex.from('blogful_articles').where({id}).delete()
    },
    updateArticle(knex, id, newArticleFields) {
        return knex.from('blogful_articles').where({id}).update(newArticleFields)
    }
};

module.exports = ArticlesService;