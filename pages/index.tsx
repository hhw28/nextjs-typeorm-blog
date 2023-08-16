import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { User } from 'src/entity/User';
import { withSession } from 'lib/withSession';

type Props = {
  user: User;
};
const index: NextPage<Props> = (props) => {
  return (
    <div>
      {props.user && <div>当前登录用户为 {props.user.username}</div>}
      <div>
        <Link href="/register">
          <a>注册</a>
        </Link>
      </div>
      <div>
        <Link href="/login">
          <a>登录</a>
        </Link>
      </div>
      <div>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </div>
    </div>
  );
};
export default index;

// @ts-ignore
export const getServerSideProps: GetServerSideProps = withSession(async (context) => {
  // @ts-ignore
  const user = context.req.session.get('currentUser');
  return {
    props: {
      user: user ? JSON.parse(JSON.stringify(user)) : null,
    },
  };
});
