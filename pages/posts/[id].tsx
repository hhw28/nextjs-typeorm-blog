import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import { withSession } from 'lib/withSession';
import { marked } from 'marked';

type Props = {
  post: Post;
  id: number;
  currentUser: string;
};
const postsShow: NextPage<Props> = (props) => {
  const { post, currentUser } = props;

  return (
    <>
      <div className="wrapper">
        <header>
          <h1>{post.title}</h1>
          {currentUser && (
            <p className="actions">
              <Link href={`/posts/edit?id=${props.id}`}>
                {/* <Link href="/posts/[id]/edit" as={`/posts/${post.id}/edit`}> */}
                <button>编辑</button>
              </Link>
              <Link href={`/posts`}>
                <button>返回列表</button>
              </Link>
            </p>
          )}
        </header>
        <article
          className="markdown-body"
          // dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></article>
      </div>
      <style jsx>{`
        .actions > * {
          margin: 4px;
        }
        .actions > *:first-child {
          margin-left: 0;
        }
        .wrapper {
          max-width: 800px;
          margin: 16px auto;
          padding: 0 16px;
        }
        h1 {
          padding-bottom: 16px;
          border-bottom: 1px solid #666;
        }
      `}</style>
    </>
  );
};

export default postsShow;

export const getServerSideProps: GetServerSideProps = withSession(
  //@ts-ignore
  async (context: GetServerSidePropsContext) => {
    const connection = await getDatabaseConnection();

    const id = context.query.id;
    //@ts-ignore
    const post = await connection.manager.findOne(Post, id);

    const currentUser = (context.req as any).session.get('currentUser') || null;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        id,
        currentUser: JSON.parse(JSON.stringify(currentUser || '')),
      },
    };
  },
);
