const connection = require('./dbConnect');
const { v4: uuidv4 } = require('uuid');

module.exports.getArticles = function ({page, pageSize, filterKey}) {
  const startIndex = (page - 1) * pageSize;
  let query;
  if (filterKey) {
    query = `select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date from articles
    where JSON_SEARCH(tag, 'one', '${filterKey}') or title LIKE '%${filterKey}%' limit ${startIndex}, ${pageSize}`
  } else {
    query = `select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date from articles limit ${startIndex}, ${pageSize}`;
  }
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    })
  })
  
}

module.exports.getAtriclesCount = function (type) {
  if (type) {}
  return new Promise((resolve, reject) => {
    connection.query('select count(*) as total from articles', (error, results, fields) => {
      if (error) reject(error);
      resolve(results[0].total);
    })
  })
}

module.exports.getArticleById = function (id) {
  return new Promise((resolve, reject) => {
    connection.query(`select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, JSON_PRETTY(comments) from articles where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve(results[0]);
    })
  })
}


module.exports.addArticle = function (article) {
  const { title, coverImg, tag, content, date, scanNumber, commentNumber } = article;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    connection.query(`insert into articles (id, title, content, coverImg, tag, date, scanNumber, commentNumber, comments)
      values ('${id}', '${title}', '${content}', '${coverImg}', '${tag}', '${date}', ${scanNumber}, ${commentNumber}, '[]')`,
      (error, results, fields) => {
        if (error) reject(error);
        resolve();
      })
  })
}

module.exports.deleteArticle = function (id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from articles where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}

module.exports.updateArticle = function (article) {
  const {id, title, content, coverImg, tag, scanNumber, commentNumber, comments} = article;
  return new Promise((resolve, reject) => {
    connection.query(`update articles set title = '${title}', content='${content}',coverImg='${coverImg}',tag='${tag}',
    scanNumber=${scanNumber},commentNumber=${commentNumber},comments='${comments}'
    where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}