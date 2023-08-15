import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import {useEffect, useState} from 'react';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';
import { User } from 'src/entity/User';
import { withSession } from 'lib/withSession';


const register: NextPage<{ user: User }> = (props) => {
    
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    username: [], 
    password: [], 
  });

  const onSubmit = () => {

    axios.post('/api/v1/login', formData).then(res => {
      window.alert('登录成功');
    }, (error) => {
      if (error.response) {
        const response: AxiosResponse = error.response;
        if (response.status === 422) {
          setErrors(response.data);
        }
      }
    })

  }

  return (
    <div>
      {props.user &&
      <div>
        当前登录用户为 {props.user.username}
      </div>
      }
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
        <button onClick={onSubmit}>登录</button>
      </div>
    </div>
  );
};

export default register;

// @ts-ignore
export const getServerSideProps: GetServerSideProps = withSession(async (context) => {
  // @ts-ignore
  const user = context.req.session.get('currentUser');  
  return {
    props: {
      user: user ? JSON.parse(JSON.stringify(user)) : null
    }
  };
});
