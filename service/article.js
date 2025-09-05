const connection = require("./dbConnect");
const { v4: uuidv4 } = require("uuid");

module.exports.getArticles = async function ({ page, pageSize, filterKey }) {
  const startIndex = (page - 1) * pageSize;
  let query;
  if (filterKey) {
    query = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, CAST(FROM_BASE64(content) AS CHAR CHARACTER SET utf8mb4) AS content from articles
    where JSON_SEARCH(tag, 'one', '${filterKey}') or title LIKE '%${filterKey}%' ORDER BY date DESC lIMIT ${startIndex}, ${pageSize}`;
  } else {
    query = `select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, CAST(FROM_BASE64(content) AS CHAR CHARACTER SET utf8mb4) AS content from articles ORDER BY date DESC limit ${startIndex}, ${pageSize}`;
  }

  try {
    const [rows, fields] = await connection.query(query);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports.getPublishArticles = async function ({
  page,
  pageSize,
  filterKey,
}) {
  const startIndex = (page - 1) * pageSize;
  let query;
  if (filterKey) {
    query = `SELECT *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, CAST(FROM_BASE64(content) AS CHAR CHARACTER SET utf8mb4) AS content from articles
    where isPublish = 1 and JSON_SEARCH(tag, 'one', '${filterKey}') or title LIKE '%${filterKey}%' ORDER BY date DESC lIMIT ${startIndex}, ${pageSize}`;
  } else {
    query = `select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, CAST(FROM_BASE64(content) AS CHAR CHARACTER SET utf8mb4) AS content from articles WHERE isPublish = 1 ORDER BY date DESC limit ${startIndex}, ${pageSize}`;
  }

  try {
    const [rows, fields] = await connection.query(query);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports.getFavoriteArticles = async function () {
  query =
    "select id, title from articles where isPublish = 1 order by scanNumber desc limit 0, 5;";
  try {
    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports.getArticlesCount = async function (type) {
  if (type) {
  }
  try {
    const [rows] = await connection.query(
      "select count(*) as total from articles where isPublish = 1"
    );
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

module.exports.getArticleById = async function (id) {
  try {
    const [rows] = await connection.query(
      `select *, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date, CAST(FROM_BASE64(content) AS CHAR CHARACTER SET utf8mb4) AS content, JSON_PRETTY(comments) from articles where id = '${id}'`
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports.addArticle = async function (article) {
  const {
    title,
    coverImg,
    tag,
    content,
    date,
    scanNumber,
    commentNumber,
    isPublish,
  } = article;
  const id = uuidv4();
  try {
    await connection.query(
      `insert into articles (id, title, content, coverImg, tag, date, scanNumber, commentNumber, comments, isPublish)
      values (?, ?, TO_BASE64(?), ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        content, // 防止sql将代码读作sql语句
        coverImg,
        tag,
        date,
        scanNumber,
        commentNumber,
        "[]",
        isPublish,
      ]
    );
  } catch (error) {
    throw error;
  }
};

module.exports.deleteArticle = async function (id) {
  try {
    await connection.query(`delete from articles where id = '${id}'`);
  } catch (error) {
    throw error;
  }
};

module.exports.updateArticle = async function (article) {
  const {
    id,
    title,
    content,
    coverImg,
    tag,
    scanNumber,
    commentNumber,
    comments,
    isPublish,
  } = article;
  try {
    await connection.query(
      `update articles set title = ?, content=TO_BASE64(?),coverImg=?,tag=?,
      scanNumber=?,commentNumber=?,comments=?, isPublish=? where id = ?`,
      [
        title,
        content,
        coverImg,
        tag,
        scanNumber,
        commentNumber,
        comments,
        isPublish,
        id,
      ]
    );
  } catch (error) {
    throw error;
  }
};
