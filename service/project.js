const connection = require('./dbConnect');
const { v4: uuidv4 } = require('uuid');

module.exports.getProjects = function() {
  return new Promise((resolve, reject) => {
    connection.query('select *, DATE_FORMAT(finish_date, "%Y-%m-%d") as finish_date from projects', (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    })
  })
}

module.exports.addProject = function(project) {
  const {project_name, cover, project_url, introduction, technology, finish_date} = project;
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    connection.query(`insert into projects (id, project_name, cover, project_url, introduction, technology, finish_date)
    values('${id}', '${project_name}', '${cover}', '${project_url}', '${introduction}', '${technology}', '${finish_date}')`,
    (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}

module.exports.deleteProject = function(id) {
  return new Promise((resolve, reject) => {
    connection.query(`delete from projects where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}

module.exports.updateProject = function(project) {
  const {id, project_name, cover, project_url, introduction, technology, finish_date} = project;
  return new Promise((resolve, reject) => {
    connection.query(`update projects set project_name = '${project_name}', cover = '${cover}', project_url = '${project_url}',
    introduction = '${introduction}', technology = '${technology}', finish_date = '${finish_date}'
    where id = '${id}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}