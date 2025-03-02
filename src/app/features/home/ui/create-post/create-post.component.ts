import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreatePost } from '../../models/create-post';
import { PostService } from '../../services/posts.service';
import { ResponseModel } from '../../../signup/models/response.model';
import TurndownService from 'turndown';
import { Post } from '../../../../core/models/Post/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  @Input() curretnUserEmail!: string | null;
  @Input() curretnUser!: ResponseModel | null;
  @Output() addPost = new EventEmitter<Post>();

  isModalOpen = false;
  title = '';
  content = '';
  postData: CreatePost = {
    title: '', content: '',
    userEmail: ''
  };
  private isInsideModal = false;

  constructor(private postService: PostService) { }

  openModal() {
    if (!this.curretnUser) {
      alert("You must login!");
      return;
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.title = '';
    this.content = '';
  }

  handleContentChange(content: string) {
    this.content = content;
    this.submitPost();
  }

  submitPost() {
    this.postData = {
      userEmail: this.curretnUserEmail!,
      title: this.title,
      content: this.content 
    };

    this.postService.createPost(this.postData).subscribe(
      (data) => {
        this.closeModal();
        this.addPost.emit(this.mapToPost(data));
      }
    );
  }

  private mapToPost(createPost: CreatePost): Post {
    const transformed = {
      id: createPost.id!,
      userName: this.curretnUser?.user.username!, 
      categoryNames: [], 
      title: createPost.title!, 
      content: createPost.content,
      createdAt: new Date(), 
      profilePictureUrl: this.curretnUser?.user.profilePictureUrl!, 
      likesCount: 0,
      commentsCount: 0, 
      isLiked: false,
    };

    return transformed;
  }

  onMouseDown(event: MouseEvent) {
    // Перевіряємо, чи натискання відбулося всередині модального вікна
    this.isInsideModal = (event.target as HTMLElement).closest('app-post-editor') !== null;
  }

  onMouseUp(event: MouseEvent) {
    // Якщо клік завершився поза модальним вікном і почався поза ним – закриваємо
    if (!this.isInsideModal && (event.target as HTMLElement).closest('app-post-editor') === null) {
      this.closeModal();
    }
  }
}
