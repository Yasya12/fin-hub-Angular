import { Component, Input } from '@angular/core';
import { CreatePost } from '../../models/create-post';
import { PostService } from '../../services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  @Input() curretnUserEmail!: string | null;
  isModalOpen = false;
  title = '';
  content = '';
  postData: CreatePost = {
    title: '', content: '',
    userEmail: ''
  };

  constructor(private postService: PostService) { }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.title = '';
    this.content = '';
  }

  submitPost() {
    if (!this.curretnUserEmail) {
      console.log(this.curretnUserEmail)
      alert("You must login!");
      return;
    }

    if (!this.content.trim() || !this.content.trim()) {
      alert("Title cannot be empty!");
      return;
    }


    this.postData = {
      userEmail: this.curretnUserEmail,
      title: this.title,
      content: this.content
    };

    this.postService.createPost(this.postData).subscribe(
      (data) => {
        console.log("yes")
      }
    );
  }
}
