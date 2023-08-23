import { NextApiHandler } from 'next';
import { withSession } from 'lib/withSession';
import { Comment } from 'src/entity/Comment';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';

const Comments: NextApiHandler = withSession(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 检查用户是否登录
  const user = req.session.get('currentUser');
  if (!user) {
    res.statusCode = 401;
    res.write(JSON.stringify({ message: '用户未登录' }));
    res.end();
    return;
  }


  const connection = await getDatabaseConnection();
  const { id, content } = req.body;

  switch (req.method) {
    case 'POST':
      const comment = new Comment();

      const post = await connection.manager.findOne(Post, id);
      comment.post = post;
      comment.user = user;
      comment.content = content;

      await comment.validate();

      if (comment.hasErrors()) {
        res.statusCode = 422;
        res.write(JSON.stringify(comment.errors));
      } else {
        await connection.manager.save(comment);
        res.statusCode = 200;
        res.write(JSON.stringify(comment));
      }
      break;
    case 'DELETE':
      await connection.manager.delete(Comment, id);
      res.statusCode = 200;
      res.json({ message: '操作成功' });
      break;

    default:
      break;
  }


  res.end();
});
export default withSession(Comments);
