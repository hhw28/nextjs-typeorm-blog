import { NextPage } from 'next';
import axios from 'axios';
import { User } from 'src/entity/User';
import { useForm } from 'hooks/useForm';

interface FormDataType {
  username: string;
  password: string;
}

const register: NextPage<{ user: User }> = (props) => {
  const { form } = useForm<FormDataType>({
    initFormData: { username: '', password: '' },
    fields: [
      { label: '用户名', key: 'username', inputType: 'text' },
      { label: '密码', key: 'password', inputType: 'password' },
    ],
    buttons: <button>登录</button>,
    submit: {
      request: (formData: FormDataType) => axios.post(`/api/v1/login`, formData),
      message: '登录成功',
      success: () => (window.location.href = '/'),
    },
  });

  return <div>{form}</div>;
};

export default register;
