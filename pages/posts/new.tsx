import { NextPage } from 'next';
import { useForm } from 'hooks/useForm';
import axios from 'axios';
import Link from 'next/link';

type FormDataType = {
  title: string;
  content: string;
};

const PostsNew: NextPage = () => {

  const { form } = useForm<FormDataType>({
    initFormData: {
      title: '',
      content: '',
    },
    fields: [
      { label: '标题', inputType: 'text', key: 'title' },
      { label: '内容', inputType: 'textarea', key: 'content' },
    ],
    buttons: <>
      <button>提交</button>
      <Link href='/posts'>
        <button>返回列表</button>
      </Link>
    </>,
    submit: {
      request: (formData: FormDataType) => axios.post(`/api/v1/posts`, formData),
      message: '新增成功',
      success() {
        window.location.href = '/posts'
      },
    },
  });

  return <div>{form}</div>;
};

export default PostsNew;
