import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { User } from 'src/entity/User';
import { withSession } from 'lib/withSession';

type Props = {
  user: User;
};
const index: NextPage<Props> = (props) => {
  return (
    <>
      {/* <span>
        {props.user && <div>当前登录用户为 {props.user.username}</div>}
      </span> */}
      <div className="cover">
        <img src="/logo.png" alt="" />
        <h1>我的博客</h1>
        <div className="action">
          <p>
            <Link href="/register">
              <a>注册</a>
            </Link>
          </p>
          <p>
            <Link href="/login">
              <a>登录</a>
            </Link>
          </p>
          <p>
            <Link href="/posts">
              <a>文章列表</a>
            </Link>
          </p>
        </div>
      </div>
      <style jsx>{`
        .cover {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .cover > img {
          width: 120px;
          height: 120px;
        }
        .action{
          display: flex;
        }

        .action > p {
          margin: 6px;
        }
      `}</style>
    </>
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
