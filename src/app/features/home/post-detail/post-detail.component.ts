import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommentService } from '../../../core/services/comment.service';
import { Comment } from '../../../core/models/comment.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'] // Змінив на `styleUrls`
})
export class PostDetailComponent implements OnInit {
  post: any;
  isLiked = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');

    if (postId) {
      this.postService.getPostById(postId).subscribe((data) => {
        this.post = data;
        console.log(data);
        const token = this.authService.currentUser()?.token;
        if (token) {
          this.checkIfLiked(postId);
        }
      });
    }
  }

  checkIfLiked(postId: string): void {
    this.postService.isPostLiked(postId).subscribe((response: any) => {
      this.isLiked = response.isLiked;
    });
  }

  toggleLike(): void {
    if (this.post && this.post.id) {
      this.postService.toggleLike(this.post.id).subscribe((response: any) => {
        this.isLiked = response.success;
        this.post.likesCount += this.isLiked ? 1 : -1;
      });
    }
  }

  createNewComment(form: any): void {
    if (form.valid && this.post) {
      const comment: Comment = {
        postId: this.post.id, // Використовуємо ID поточного поста
        content: form.value.content, // Текст коментаря з форми
        authorId: this.authService.currentUser()?.user.id || '' // ID автора з AuthService
        
      };

      console.log(this.authService.currentUser())

      this.commentService.addComment(comment).subscribe({
        next: (response) => {
          console.log('Comment added successfully:', response);
          form.reset(); // Очистити форму після успішного додавання
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
    }
  }
}
