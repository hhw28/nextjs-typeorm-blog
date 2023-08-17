import { GetServerSideProps, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import { usePager } from 'hooks/usePager';
import { useCallback } from 'react';
import axios from 'axios';

type Props = {
  posts: Post[];
  pageSize: number;
  page: number;
  total: number;
  totalPage: number;
};
const index: NextPage<Props> = (props) => {
  const { posts, page, total, totalPage } = props;

  const { pager } = usePager({ page, total, totalPage });

  const onDelete = useCallback((id: number) => {
    axios.delete(`/api/v1/posts`, { data: { id } }).then((res) => {
      window.location.reload()
    });
  }, []);

  return (
    <div>
      <h1>文章列表</h1>
      <Link href={'/posts/new'}>
        <button>新增</button>
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>

            <button onClick={() => onDelete(post.id)}>删除</button>
          </li>
        ))}
      </ul>
      <footer>{pager}</footer>
    </div>
  );
};
export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      pageSize,
      page,
      total,
      totalPage,
    },
  };
};
