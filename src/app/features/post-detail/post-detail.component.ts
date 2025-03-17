import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  // Services
  private readonly route = inject(ActivatedRoute);

  // States
  postId: string | null = null;
  commentCount = 0;

  // Lifecycle hooks
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.postId = postId;
  }

  updateCommentCount(): void {
    this.commentCount += 1;
  }
}
