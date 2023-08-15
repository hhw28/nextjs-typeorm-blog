import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import {useEffect, useState} from 'react';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';


const register: NextPage = (props) => {

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirmation: ''
  })

  const [errors, setErrors] = useState({
    username: [], password: [], passwordConfirmation: []
  });

  const onSubmit = () => {

    axios.post('/api/v1/register', formData).then(res => {
      window.alert('注册成功');
      window.location.href = '/login';
    }, (error) => {
      if (error.response) {
        const response: AxiosResponse = error.response;
        if (response.status === 422) {
          setErrors(response.data);
        }
      }
    })

  }

  const onReset = () => {
    setFormData({
      username: '',
      password: '',
      passwordConfirmation: ''
    })
  }

  return (
    <div>
      <div>
        <label>用户名
          <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
        </label>
        {errors.username?.length > 0 && <div>
            {errors.username.join(',')}
          </div>}
      </div>
      <div>
        <label>密码
        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </label>
        {errors.password?.length > 0 && <div>
            {errors.password.join(',')}
          </div>}
      </div>
      <div>
        <label>确认密码
        <input type="password" value={formData.passwordConfirmation} onChange={(e) => setFormData({...formData, passwordConfirmation: e.target.value})} />
        </label>
        {errors.passwordConfirmation?.length > 0 && <div>
            {errors.passwordConfirmation.join(',')}
          </div>}
      </div>

      <div>
        <button onClick={onSubmit}>注册</button>
        <button onClick={onReset}>重置</button>
      </div>
    </div>
  );
};

export default register;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const connection = await getDatabaseConnection()
//   const posts = await connection.manager.find(Post)
  
//   return {
//     props: {
//       posts: JSON.parse(JSON.stringify(posts)),
//     }
//   };
// };
