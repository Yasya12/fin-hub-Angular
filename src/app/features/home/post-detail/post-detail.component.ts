import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent  implements OnInit {
  post: any;
  isLiked = false;

  constructor(private route: ActivatedRoute, private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void { 
    const postId = this.route.snapshot.paramMap.get('id');
    
    if (postId) {
      this.postService.getPostById(postId).subscribe((data) => {
        this.post = data;
        const token = this.authService.getToken();
        console.log(token);
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
}
