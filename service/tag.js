const connection = require('./dbConnect');
const { v4: uuidv4 } = require('uuid');

module.exports.getTags = function () {
  return new Promise((resolve, reject) => {
    connection.query('select * from tags', (error, results, fields) => {
      if (error) reject(error);
      resolve(results); 
    })
  })
}

module.exports.addTag = function (tag_name) {
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    connection.query(`insert into tags (id, tag_name, article_count) values ('${id}', '${tag_name}', 0)`, (error, results, fields) => {
      if (error) reject(error);
      resolve()
    })
  })
}

module.exports.deleteTag = function (id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from tags where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve()
    })
  })
}