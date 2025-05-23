import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
} from '@angular/core';
import { Post } from '../../models/post.interface';
import { PostService } from '../../../../shared/services/post.service';
import { LikeService } from '../../../../shared/services/like.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { ScrollService } from '../../../../shared/services/scroll.service';
import { PostDetailStore } from '../../../post-detail/stores/post-detail/post-detail.store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
  standalone: false,
  providers: [PostDetailStore]
})
export class PostsComponent implements OnInit {
  View: string | TemplateRef<unknown> | undefined;
  ngAfterViewInit(): void {
    if (!this.postService.paginatedResult()) {
      this.loadPosts();
    }
  }
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly router = inject(Router);
  private readonly scrollService = inject(ScrollService);

  //Stores
  posrDetailStore = inject(PostDetailStore); //TODO: write a store for the auth and dont use the post detail store here

  // Inputs
  currentUser = input<ResponseModel>();

  tooltipProfile: string = 'View Profile';
  tooltipPost: string = 'Go to Post';

  // States
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  newPost = signal<Post | undefined>(undefined);
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1; // default until first load

  hasMorePosts = true;
  lastScrollTop: number = 0;

  myEffect = effect(
    () => {
      const post = this.newPost();
      if (post && typeof post === 'object') {
        this.posts.update((posts) => [post, ...posts]);
      }
    },
    { allowSignalWrites: true }
  );

  //
  showModal: boolean = false;
  hoveredUser: string = '';
  modalPosition = { top: 0, left: 0 };

 showUserModal(userName: string, container: HTMLElement): void {
  this.hoveredUser = userName;
  this.showModal = true;

  const rect = container.getBoundingClientRect();

  this.modalPosition = {
    top: rect.top + window.scrollY + rect.height + 5,
    left: rect.left + window.scrollX,
  };
}


  hideUserModal() {
    this.showModal = false;
    this.hoveredUser = '';
  }

  goToUserProfile(event: Event, userName: string): void {
    // Зупиняємо спливання події на контейнер
    event.stopPropagation();
    this.router.navigate(['/member', userName]);
  }

  navigateToPost(postId: string) {
    this.router.navigateByUrl(`/home/post/${postId}`);
  }


  //

  // Lifecycle hooks
  ngOnInit(): void {
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

  //Methods
  

  async loadPosts() {
    if (!this.hasMorePosts || this.loading()) {
      return;
    };

    this.loading.set(true);

    const currentUserId = this.posrDetailStore.getCurrentUserId();

    if (currentUserId) {
      await firstValueFrom(this.postService.getPostsWithLikes(this.pageNumber, this.pageSize));
    } else {
      await firstValueFrom(this.postService.getPosts(this.pageNumber, this.pageSize));
    }
    const paginatedResult = this.postService.paginatedResult();
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
