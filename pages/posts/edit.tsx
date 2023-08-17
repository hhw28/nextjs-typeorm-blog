// 该文件为展示页面代码复用操作，无实际意义

// import PostsNew from './new';

// export default PostsNew;

import { GetServerSideProps, NextPage } from 'next';
import { useForm } from 'hooks/useForm';
import axios from 'axios';
import Link from 'next/link';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';

type Props = {
  post: Post;
  id: number;
};

type FormDataType = {
  title: string;
  content: string;
  id: number;
};

const PostsEdit: NextPage<Props> = (props) => {
  const { post, id } = props;

  const { form } = useForm<FormDataType>({
    initFormData: {
      title: post.title || '',
      content: post.content || '',
      id
    },
    fields: [
      { label: '标题', inputType: 'text', key: 'title' },
      { label: '内容', inputType: 'textarea', key: 'content' },
    ],
    buttons: (
      <>
        <button>更新</button>
        <Link href="/posts">
          <button>返回列表</button>
        </Link>
      </>
    ),
    submit: {
      request: (formData: FormDataType) => axios.put(`/api/v1/posts`, formData),
      message: '更新成功',
      success() {
        window.location.href = `/posts/${props.id}`;
      },
    },
  });

  return (
    <div>
      <h1>{!props.post && '博客不存在'}</h1>
      {form}
    </div>
  );
};

export default PostsEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(context.query.id?.toString()) || null;

  const connection = await getDatabaseConnection();
  // @ts-ignore
  const post = id && (await connection.manager.findOne(Post, id));

  return {
    props: {
      post: JSON.parse(JSON.stringify(post || '')),
      id,
    },
  };
};
