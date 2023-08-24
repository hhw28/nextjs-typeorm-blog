import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import md5 from 'md5';
import _ from 'lodash';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar')
  username: string;
  @Column('varchar')
  passwordDigest: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany('Post', 'author')
  posts: Post[];
  @OneToMany('Comment', 'user')
  comments: Comment[];

  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[],
  };

  password: string;
  passwordConfirmation: string;

  async validate() {
    if (this.username.trim() === '') {
      this.errors.username.push('不能为空');
    }
    if (!/[a-zA-Z0-9]/.test(this.username.trim())) {
      this.errors.username.push('格式不合法');
    }
    if (this.username.trim().length > 42) {
      this.errors.username.push('太长');
    }
    if (this.username.trim().length < 3) {
      this.errors.username.push('太短');
    }

    // yarn m:run 时连接数据库此处会报错，可以先删除连接代码之后恢复
    const found = await (
      await getDatabaseConnection()
    ).manager.find('User', { username: this.username });
    if (found.length > 0) {
      this.errors.username.push('用户名已存在');
    }

    if (this.password === '') {
      this.errors.password.push('不能为空');
    }
    if (this.password !== this.passwordConfirmation) {
      this.errors.passwordConfirmation.push('密码不匹配');
    }
  }

  hasErrors() {
    return !!Object.values(this.errors).find((v) => v.length > 0);
  }

  @BeforeInsert()
  generatePasswordDigest() {
    this.passwordDigest = md5(this.password);
  }

  toJSON() {
    return _.omit(this, ['password', 'passwordConfirmation', 'passwordDigest', 'errors']);
  }
}
