import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import { NextApiHandler } from 'next';
import { Post } from 'src/entity/Post';

const Posts: NextApiHandler = withSession(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const connection = await getDatabaseConnection();
  const { title, content, id } = req.body;

  // 检查用户是否登录
  const user = req.session.get('currentUser');
  if (!user) {
    res.statusCode = 401;
    res.write(JSON.stringify({ message: '用户未登录' }));
    res.end();
    return;
  }

  switch (req.method) {
    case 'POST':
      const post = new Post();
      post.title = title;
      post.content = content;
      post.author = user;

      await post.validate();

      if (post.hasErrors()) {
        res.statusCode = 422;
        res.write(JSON.stringify(post.errors));
      } else {
        await connection.manager.save(post);
        res.statusCode = 200;
        res.json(post);
      }
      break;
    case 'DELETE':
      await connection.manager.delete(Post, id);
      res.statusCode = 200;
      res.json({ message: '操作成功' });
      break;
    case 'PUT':      
      await connection.manager.update(Post, id, {title, content});
      res.statusCode = 200;
      res.json({ message: '操作成功' });
      break;

    default:
      break;
  }

  res.end();
});
export default Posts;
