import { Component, effect, inject, input, signal } from '@angular/core';
import { PostService } from '../../../shared/services/post.service';
import { firstValueFrom } from 'rxjs';
import { Post } from '../../home/models/post.interface';
import { PostDetailStore } from '../../post-detail/stores/post-detail/post-detail.store';
import { LikeService } from '../../../shared/services/like.service';
import { ScrollService } from '../../../shared/services/scroll.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ResponseModel } from '../../../shared/models/interfaces/response.model';

@Component({
  selector: 'app-hub-posts',
  templateUrl: './hub-posts.component.html',
  styleUrl: './hub-posts.component.css',
  providers: [PostDetailStore]
})
export class HubPostsComponent {
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);
  private readonly authService = inject(AuthService);
  

  //Stores
  //posrDetailStore = inject(PostDetailStore); //TODO: write a store for the auth and dont use the post detail store here

  // Inputs
  curretnUser: ResponseModel | undefined = undefined;
  hubId = input.required<string>();//
  userCanWritePost = input.required<boolean>();

  // States
  posts = signal<Post[]>([]); //
  loading = signal<boolean>(false); //
  newPost = signal<Post | undefined>(undefined);
  pageNumber = 1; //
  pageSize = 10; //
  totalPages = 1; // default until first load

  hasMorePosts = true; //
  //lastScrollTop: number = 0;

  myEffect = effect(
    () => {
      const post = this.newPost();
      if (post && typeof post === 'object') {
        this.posts.update((posts) => [post, ...posts]);
      }
    },
    { allowSignalWrites: true }
  );

  // Lifecycle hooks
  ngOnInit(): void {

    console.log(this.userCanWritePost())
    this.curretnUser = this.authService.currentUser();
    
    this.loadPosts();


    this.scrollService.scrollContainer$.subscribe((container) => {
      if (container) {
        container.nativeElement.addEventListener(
          'scroll',
          this.onScroll.bind(this)
        );
      }
    });
  }
  
  ngAfterViewInit(): void {
    if (!this.postService.paginatedHubResult()) {
      this.loadPosts();
    }
  }

  //Methods
  async loadPosts() {
    if (!this.hasMorePosts || this.loading()) {
      return;
    };

    this.loading.set(true);

    const currentUserId = this.authService.currentUser()?.user.id;

    if (currentUserId) {
      await firstValueFrom(this.postService.getHubPostsWithLikes(this.pageNumber, this.pageSize, this.hubId()!.toString()));
    } else {
      await firstValueFrom(this.postService.getHubPosts(this.pageNumber, this.pageSize, this.hubId()!.toString()));
    }
    const paginatedResult = this.postService.paginatedHubResult();
    this.totalPages = Number(paginatedResult?.pagination?.totalPages ?? 1);

    if (!paginatedResult || !paginatedResult.items) return;

    if (paginatedResult.items.length < this.pageSize) {
      this.hasMorePosts = false;
    }

    this.posts.update((posts) => [...posts, ...paginatedResult.items!]);
    this.loading.set(false);
  }

  toggleLike(post: Post): void {
    this.likeService.toggleLike(post.id).subscribe(() => {
      this.posts.update((posts) =>
        posts.map((p) =>
          p.id === post.id
            ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
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
    const container = event.target as HTMLElement;
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - container.scrollHeight * 0.1
    ) {
      if (this.pageNumber < this.totalPages) {
        this.pageNumber++;
        this.loadPosts();
      } else {
        this.hasMorePosts = false;
      }
    }
  }
}
