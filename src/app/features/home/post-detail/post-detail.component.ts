import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent  implements OnInit {
  post: any;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void { 
    const postId = this.route.snapshot.paramMap.get('id');
    
    if (postId) {
      this.postService.getPostById(postId).subscribe((data) => {
        this.post = data;
        console.log('Fetched posts:', this.post);
      });
    }
  }
}
