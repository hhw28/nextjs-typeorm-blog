import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import {useEffect, useState} from 'react';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import Link from 'next/link';

type Props = {

}
const index: NextPage<Props> = (props) => {
  return (
    <div>
      <div>
        <Link href="/register">
          <a>注册</a>
        </Link>
      </div>
      <div>
        <Link href="/login">
          <a>登录</a>
        </Link>
      </div>
      <div>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </div>
    </div>
  );
};
export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  return {
    props: {}
  };
};
