import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  postId: string | null = null;
  commentCount = 0;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.postId = postId;
  }

  updateCommentCount(newCount: number): void {
    this.commentCount = newCount; 
  }
}
