import React, { useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import { Comment } from 'src/entity/Comment';
import Link from 'next/link';
import { withSession } from 'lib/withSession';
import { marked } from 'marked';
import { useForm } from 'hooks/useForm';
import axios from 'axios';
import { User } from 'src/entity/User';

type Props = {
  post: Post;
  id: number;
  currentUser: User;
  comments?: Comment[];
};

type FormDataType = {
  content: string;
  id: number;
};
const postsShow: NextPage<Props> = (props) => {
  const { post, currentUser, id } = props;

  const isAuthor = currentUser.id === post.author.id

  const onDelete = useCallback((id) => {
    axios.delete(`/api/v1/comments`, { data: { id } }).then(
      (res) => {
        window.alert('删除成功');
        window.location.reload();
      },
      () => {
        window.alert('删除失败');
      },
    );
  }, []);

  const onPostDelete = useCallback((id: number) => {
    axios.delete(`/api/v1/posts`, { data: { id } }).then(
      (res) => {
        window.alert('删除成功');
        window.location.href = '/posts'
      },
      () => {
        window.alert('删除失败');
      },
    );
  }, []);

  const { form } = useForm<FormDataType>({
    initFormData: {
      content: '',
      id,
    },
    fields: [{ label: '内容', inputType: 'textarea', key: 'content' }],
    buttons: (
      <>
        <button>提交</button>
      </>
    ),
    submit: {
      request: (formData: FormDataType) => axios.post(`/api/v1/comments`, formData),
      message: '评论成功',
      success() {
        window.location.href = `/posts/${props.id}`;
      },
    },
  });

  return (
    <>
      <div className="wrapper">
        <header>
          <h1>{post.title}</h1>

          <p className="actions">
            {isAuthor && (
              <>
                <Link href={`/posts/edit?id=${props.id}`}>
                  {/* <Link href="/posts/[id]/edit" as={`/posts/${post.id}/edit`}> */}
                  <button>编辑</button>
                </Link>
                <button onClick={() => onPostDelete(props.id)}>删除</button>
              </>
            )}

            <Link href={`/posts`}>
              <button>返回列表</button>
            </Link>
          </p>
        </header>
        <article
          className="markdown-body"
          // dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></article>
        <h3>评论</h3>
        <ul>
          {props.comments.map((comment) => (
            <li key={comment.id} className="comment">
              <div className="user">
                <div>{comment.user.username}</div>
              </div>
              <div className="detail">
                <span className="time">{comment.createdAt}</span>
                <span className="content">{comment.content}</span>
              </div>
              {
                isAuthor &&  <button onClick={() => onDelete(comment.id)}>删除</button>
              }
            </li>
          ))}
        </ul>
        {form}
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

        .comment {
          display: flex;
          flex-direction: row;
          margin-top: 24px;
        }
        .comment .user {
          background: #ccc;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          text-align: center;
          line-height: 40px;
          margin-right: 12px;
          font-size: 6px;
        }
        .comment .detail {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .comment .detail .time {
          font-size: 10px;
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
    const post = await connection
      .getRepository(Post)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'users')
      .where("posts.id = :id", { id })
      .getOne();
    const comments = await connection
      .getRepository(Comment)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.post', 'posts')
      .leftJoinAndSelect('comments.user', 'users')
      .where('posts.id = :id', { id })
      .getMany();

    const currentUser = (context.req as any).session.get('currentUser') || null;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
        comments: JSON.parse(JSON.stringify(comments)),
        id,
        currentUser: JSON.parse(JSON.stringify(currentUser || '')),
      },
    };
  },
);
