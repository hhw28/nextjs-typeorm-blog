import { GetServerSideProps, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import { usePager } from 'hooks/usePager';

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

  return (
    <div>
      <h1>文章列表</h1>
      <Link href={'/posts/new'}>
        <button>新增</button>
      </Link>
      {posts.map((post) => (
        <div key={post.id}>
          <Link href={`/posts/${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </div>
      ))}
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
