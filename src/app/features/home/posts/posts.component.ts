import { Component, OnInit } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import {PostService} from "../../../core/services/post.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  
  loading =true;

  constructor(private postService: PostService){}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;
        this.loading = false;
        console.log('Fetched posts:', this.posts); // Лог для отриманих постів
        
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.loading = false;
      }
    )
  }
}
