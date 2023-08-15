import {NextApiHandler} from 'next';
import {getPosts} from 'lib/posts';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Login } from 'src/model/Login';
import { withSession } from 'lib/withSession';


const Sessions: NextApiHandler = async (req, res) => {

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const {username, password} = req.body;
  const login = new Login();
  login.username = username
  login.password = password

  await login.validate();
  
  if (login.hasErrors()) {
    res.statusCode = 422;
    res.write(JSON.stringify(login.errors));
  } else {
    req.session.set('currentUser', login.user);
    await req.session.save()

    res.statusCode = 200;
    res.write(JSON.stringify(login));
  }
  res.end();
};
export default withSession(Sessions);