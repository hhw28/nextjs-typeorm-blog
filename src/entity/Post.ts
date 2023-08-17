import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar')
  title: string;
  @Column('text')
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne((type) => User, (user) => user.posts)
  author: User;
  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];

  errors = {
    title: [] as string[],
    content: [] as string[],
  };

  async validate() {
    if (this.title.trim() === '') {
      this.errors.title.push('标题不能为空');
    }
    if (this.content.trim() === '') {
      this.errors.content.push('内容不能为空');
    }
  }

  hasErrors() {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }
}
