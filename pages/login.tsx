import { NextPage } from 'next';
import axios from 'axios';
import { User } from 'src/entity/User';
import { useForm } from 'hooks/useForm';
import qs from 'querystring';

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
      success: () => {
        const query = qs.parse(window.location.search.substr(1));
        console.log(query);
        window.location.href = query.return_to?.toString() || '/';
      },
    },
  });

  return (
    <>
      <div className="wrapper">{form}</div>
      <style jsx>
        {`
          .wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
        `}
      </style>
    </>
  );
};

export default register;
