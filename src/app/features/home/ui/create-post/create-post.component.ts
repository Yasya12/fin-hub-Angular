import { Component, Input } from '@angular/core';
import { CreatePost } from '../../models/create-post';
import { PostService } from '../../services/posts.service';
import { ResponseModel } from '../../../signup/models/response.model';
import TurndownService from 'turndown';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  @Input() curretnUserEmail!: string | null;
  @Input() curretnUser!: ResponseModel | null;
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
    if (!this.curretnUserEmail) {
      console.log(this.curretnUserEmail);
      alert("You must login!");
      return;
    }
  
    if (!this.content.trim()) {
      alert("Content cannot be empty!");
      return;
    }
  
    // Convert HTML to Markdown
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(this.content);
    console.log(markdownContent)
  
    this.postData = {
      userEmail: this.curretnUserEmail,
      title: this.title,  
      content: markdownContent // Now storing Markdown instead of HTML
    };
  
    this.postService.createPost(this.postData).subscribe(
      (data) => {
        console.log("Post submitted as Markdown.");
      }
    );
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
