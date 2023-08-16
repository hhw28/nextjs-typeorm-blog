import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import {ChangeEvent, useCallback, useEffect, useState} from 'react';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';
import axios, { AxiosResponse } from 'axios';
import { User } from 'src/entity/User';
import { withSession } from 'lib/withSession';
import { useForm } from 'hooks/useForm';

interface FormDataType{
  username: string;
  password: string;
}

const register: NextPage<{ user: User }> = (props) => {

  const request = (formData: FormDataType) => {
    console.log('formData', formData);
    
    return axios.post('/api/v1/login', formData)
  }

  const {form} = useForm<FormDataType>({
    initFormData: {username:'', password: ''},
    fields:[
      {label: '用户名', key:'username', inputType:'text'},
      {label: '密码', key:'password', inputType:'password'},
    ],
    buttons: <button>登录</button>,
    submit: {
      request: (formData: FormDataType) => axios.post(`/api/v1/login`, formData),
      message: '登录成功'
    }
  })

  // const [errors, setErrors] = useState({
  //   username: [], 
  //   password: [], 
  // });


  return (
    <div>
      {props.user &&
      <div>
        当前登录用户为 {props.user.username}
      </div>
      }
      {form}
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
