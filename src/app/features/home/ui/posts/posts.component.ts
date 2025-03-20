import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { Post } from '../../../../core/models/Post/post.model';
import { PostService } from "../../../../shared/services/post.service";
import { LikeService } from '../../../../shared/services/like.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../signup/models/response.model';
import { ScrollService } from '../../../../shared/services/scroll.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  standalone: false
})
export class PostsComponent implements OnInit {
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  // Inputs
  currentUser = input<ResponseModel>();

  // States
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  newPost = signal<Post | undefined>(undefined);
  pageNumber = 1;
  pageSize = 10;
  hasMorePosts = true;
  lastScrollTop: number = 0;

  myEffect = effect(() => {
    const post = this.newPost();
    if (post && typeof post === 'object') {
      this.posts.update(posts => [post, ...posts]);
    }
  }, { allowSignalWrites: true });
  
  // Lifecycle hooks
  ngOnInit(): void {
    this.loadPosts();
  
    this.scrollService.scrollContainer$.subscribe(container => {
      if (container) {
        container.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      }
    });
  }

  //Methods
  async loadPosts(): Promise<void> {
    if (!this.hasMorePosts || this.loading()) return;

    this.loading.set(true);

    const userId = this.currentUser()?.user.id;

    const postObservable = userId
      ? this.postService.getPostsWithLikes(userId, this.pageNumber, this.pageSize)
      : this.postService.getPosts(this.pageNumber, this.pageSize);

    postObservable.subscribe({
      next: (items) => {
        if (items.length < this.pageSize) {
          this.hasMorePosts = false;
        }
        this.posts.update(posts => [...posts, ...items]);

        this.loading.set(false);
        this.pageNumber++;
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      this.posts.update(posts =>
        posts.map(p =>
          p.id === post.id
            ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
            : p
        )
      );
    });
  }

  addPost(post: Post): void {
    this.newPost.set(post);
  }

  navigateToPost(postId: string) {
    this.router.navigateByUrl(`/home/post/${postId}`);
  }

  // Event handlers
  onLinkClick(event: Event, postId: string) {
    event.preventDefault();
    event.stopPropagation();
    this.navigateToPost(postId);
  }

  onScroll(event: Event): void {
    if (!this.hasMorePosts) return;
    const container = (event.target as HTMLElement);
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - container.scrollHeight * 0.1) {
      this.loadPosts();
    }
  }
}
