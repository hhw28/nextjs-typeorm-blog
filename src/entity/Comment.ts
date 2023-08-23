import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import {User} from './User';
import {Post} from './Post';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text')
  content: string;
  @ManyToOne('User', 'comments')
  user: User;
  @ManyToOne('Post', 'comments')
  post: Post;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  async validate() {
    if (this.content.trim() === '') {
      this.errors.content.push('评论不能为空');
    }
  }

  errors = {
    content: [] as string[],
  };

  hasErrors() {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }
}
