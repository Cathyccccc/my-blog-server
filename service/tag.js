const connection = require("./dbConnect");
const { v4: uuidv4 } = require("uuid");

module.exports.getTags = async function () {
  try {
    const [rows] = await connection.query("select * from tags");
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports.addTag = async function (tag_name) {
  const id = uuidv4();
  try {
    await connection.query(
      `insert into tags (id, tag_name, article_count) values ('${id}', '${tag_name}', 0)`
    );
  } catch (error) {
    throw error;
  }
};

module.exports.deleteTag = async function (id) {
  await connection.query(`delete from tags where id = '${id}'`);
};

module.exports.getTagsInUse = async function () {
  await connection.query(
    `SELECT DISTINCT tag.id FROM articles, JSON_TABLE(tag, '$[*]' COLUMNS (id CHAR(36) PATH '$.id')) AS tag`
  );
};
