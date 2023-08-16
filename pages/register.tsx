import { NextPage } from 'next';
import { useCallback, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useForm } from 'hooks/useForm';

interface FormDataType {
  username: string;
  password: string;
  passwordConfirmation: string;
}

const register: NextPage = () => {
  const initFormData = { username: '', password: '', passwordConfirmation: '' };

  const onReset = useCallback((e) => {
    e.preventDefault();
    setFormData(initFormData);
  }, []);

  const { form, setFormData } = useForm<FormDataType>({
    initFormData,
    fields: [
      { label: '用户名', key: 'username', inputType: 'text' },
      { label: '密码', key: 'password', inputType: 'password' },
      { label: '确认密码', key: 'passwordConfirmation', inputType: 'password' },
    ],
    buttons: (
      <>
        <button>注册</button>
        <button onClick={onReset}>重置</button>
      </>
    ),
    submit: {
      request: (formData: FormDataType) => axios.post(`/api/v1/register`, formData),
      message: '注册成功',
      success: () => (window.location.href = '/login'),
    },
  });

  return <div>{form}</div>;
};

export default register;
