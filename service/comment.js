const connection = require('./dbConnect');
const { v4: uuidv4 } = require('uuid');

// 获取评论列表数据
module.exports.getComments = function () {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT id as articleId, title, JSON_UNQUOTE(
      JSON_EXTRACT(
        comments,
        CONCAT('$[', help_topic.help_topic_id, ']')
      )
    ) AS comment FROM articles
    JOIN mysql.help_topic ON help_topic.help_topic_id < JSON_LENGTH(comments)
    WHERE JSON_VALID(comments) AND JSON_LENGTH(comments);`, (error, results, fields) => {
      if (error) reject(error);
      resolve(results);
    })
  })
}

// 新增一条评论/回复（针对某个文章/某个评论）
module.exports.addComment = function (articleId, commentId, comment, replyArr) {
  const id = uuidv4();
  if (!commentId) {
    comment.commentId = id;
    comment = JSON.stringify(comment);
    return new Promise((resolve, reject) => {
      connection.query(`update articles set comments = JSON_ARRAY_APPEND(comments, '$', cast('${comment}' as json))
        where id = '${articleId}'`, (error, results, fields) => {
        if (error) reject(error);
        resolve();
      })
    })
  } else {
    comment.replyId = id;
    replyArr = JSON.parse(replyArr);
    // if (replyArr.length) {
      replyArr.push(comment);
      console.log(replyArr)
      replyArr = JSON.stringify(replyArr);
      return new Promise((resolve, reject) => {
        connection.query(`update articles set comments = JSON_SET(comments,
          REPLACE
            (JSON_UNQUOTE
                (JSON_SEARCH(comments, 'one', '${commentId}', null, '$**.commentId' )
            ),
            'commentId', 'replyArr'),
          cast ('${replyArr}' as json))
        where id = '${articleId}' and JSON_CONTAINS(comments, JSON_OBJECT("commentId", '${commentId}'))`, (error, results, fields) => {
          if (error) reject(error);
          resolve();
        })
      })
    // } else {
    //   replyArr = JSON.stringify(replyArr);
    //   return new Promise((resolve, reject) => {
    //     connection.query(`update articles set comments = JSON_SET(comments,
    //       REPLACE
    //         (JSON_UNQUOTE
    //             (JSON_SEARCH(comments, 'one', '${commentId}', null, '$**.commentId' )
    //         ),
    //         'commentId', 'replyArr'),
    //       cast ('${replyArr}' as json))
    //     where id = '${articleId}' and JSON_CONTAINS(comments, JSON_OBJECT("commentId", '${commentId}')
    //       )`, (error, results, fields) => {
    //         if (error) reject(error);
    //         resolve();
    //       })
    //   })
    // }

  }

}

// 删除一条评论（针对某个文章）
module.exports.deleteComment = function (articleId, commentId) {
  return new Promise((resolve, reject) => {
    connection.query(`
    UPDATE articles
      SET comments = JSON_REMOVE(
        comments, JSON_UNQUOTE(
          REPLACE(
            JSON_SEARCH(comments, 'one', '${commentId}', null, '$**.comments')
            , '.commentId'
            , ''
          )
        )
      ) where id = '${articleId}'`, (error, results, fields) => {
      if (error) reject(error);
      resolve();
    })
  })
}