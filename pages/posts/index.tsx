import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import { usePager } from 'hooks/usePager';
import { useCallback } from 'react';
import axios from 'axios';
import { withSession } from 'lib/withSession';

type Props = {
  posts: Post[];
  pageSize: number;
  page: number;
  total: number;
  totalPage: number;
  currentUser: string;
};
const index: NextPage<Props> = (props) => {
  const { posts, page, total, totalPage, currentUser } = props;

  const { pager } = usePager({ page, total, totalPage });

  return (
    <>
      <div className="posts">
        <header>
          <h1>文章列表</h1>
          {currentUser && (
            <Link href="/posts/new">
              <button>新增文章</button>
            </Link>
          )}
          <Link href="/">
            <button>主页</button>
          </Link>
        </header>

        {posts.map((post) => (
          <div className="onePost" key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <span>{post.title}</span>
            </Link>

            {/* <div>
              <Link href={`/posts/${post.id}`}>
                <button>查看</button>
              </Link>
            </div> */}
          </div>
        ))}

        <footer className="footer">{pager}</footer>
      </div>
      <style jsx>{`
        .posts {
          max-width: 800px;
          margin: 0 auto;
          padding: 16px;
        }
        .posts > header {
          display: flex;
          align-items: center;
        }
        .posts > header > h1 {
          margin: 0;
          margin-right: auto;
        }
        .onePost {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding: 8px 0;
        }
        .onePost > span {
          border-bottom: none;
          color: #000;
          cursor: pointer;
        }
        .onePost > span:hover {
          color: #00adb5;
        }
        .footer {
          margin-top: 16px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
        }
      `}</style>
        <style jsx global>
        {`
          button + button {
            margin: 6px;
          }
        `}
      </style>
    </>
  );
};
export default index;

export const getServerSideProps: GetServerSideProps = withSession(
  // @ts-ignore
  async (context: GetServerSidePropsContext) => {
    const { query } = context;

    const page = parseInt(query.page?.toString()) || 1;
    const pageSize = 10;

    const connection = await getDatabaseConnection();
    const [posts, count] = await connection.manager.findAndCount(Post, {
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const total = count;
    const totalPage = Math.ceil(total / pageSize);

    const currentUser = (context.req as any).session.get('currentUser') || null;

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        pageSize,
        page,
        total,
        totalPage,
        currentUser: JSON.parse(JSON.stringify(currentUser || '')),
      },
    };
  },
);
