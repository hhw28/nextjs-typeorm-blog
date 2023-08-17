import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link  from 'next/link';

type Props = {
  post: Post;
  id: number;
};
const postsShow: NextPage<Props> = (props) => {
  const { post } = props;

  return (
    <div>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      <Link href={`/posts/edit?id=${props.id}`}>
        <button>修改</button>
      </Link>
      <Link href={`/posts`}>
        <button>返回列表</button>
      </Link>
    </div>
  );
};

export default postsShow;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection();
  //@ts-ignore
  const post = await connection.manager.findOne(Post, context.params.id);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      id: context.params.id
    },
  };
};
