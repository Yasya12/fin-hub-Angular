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
  content = '';
  postData: CreatePost = {
    content: '',
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
    this.content = '';
  }

  handleContentChange(content: string, images: string[]) {
    const cleanedContent = this.cleanContent(content);

    this.content = cleanedContent; // Ensure the variable is updated correctly

    this.submitPost(images);
  }

  submitPost(images: string[]) {
    const formData = new FormData();

    formData.append('UserEmail', this.curretnUserEmail!);
    formData.append('Content', this.content);

    // Convert Base64 images to File and append them
    images.forEach((base64Image, index) => {
      const file = this.base64ToFile(base64Image, `image${index}.png`);
      formData.append('Images', file);
    });

    this.postService.createPost(formData).subscribe(
      (data) => {
        this.closeModal();
        this.addPost.emit(this.mapToPost(data));
      }
    );
  }

  cleanContent(content: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    // Remove all <img> elements
    doc.querySelectorAll("img").forEach(img => img.remove());

    // Remove all <span> and <button> elements (if unwanted)
    doc.querySelectorAll("span, button").forEach(element => element.remove());

    // Remove inline styles from all elements
    doc.querySelectorAll('*').forEach(el => el.removeAttribute('style'));

    // Return cleaned content without any unwanted tags or styles
    return doc.body.innerHTML.trim();
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private mapToPost(createPost: CreatePost): Post {
    const transformed = {
      id: createPost.id!,
      userName: this.curretnUser?.user.username!,
      categoryNames: [],
      content: createPost.content,
      createdAt: new Date(),
      profilePictureUrl: this.curretnUser?.user.profilePictureUrl!,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      images: createPost.images
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
