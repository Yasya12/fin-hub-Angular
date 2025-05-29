import { AfterViewInit, Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Post } from '../../../features/home/models/post.interface';
import { LikeService } from '../../services/like.service';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { FormattedDatePipe } from "../../pipes/FormattedDatePipe";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormattedDatePipe, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, AfterViewInit {
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly router = inject(Router);

  // Inputs
  specificUserId = input.required<string>();
  selectedTab = input.required<string>();
  isNeedToReset = input.required<boolean>();

  @Output() resetHandled = new EventEmitter<void>();

  // States
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  hasMorePosts = true;

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadPosts();

    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  ngAfterViewInit(): void {
    if (!this.postService.paginatedForSpecificUser()) {
      this.loadPosts();
    }
  }

  //Methods
  async loadPosts() {
    if (!this.hasMorePosts || this.loading()) {
      return;
    };

    this.loading.set(true);

    if(this.isNeedToReset()){
      this.postService.paginatedForSpecificUser.set(undefined);
       this.resetHandled.emit();
    }

    console.log(this.selectedTab() )

    if (this.selectedTab() == "posts")
      await firstValueFrom(this.postService.getPostsForSpecificUser(this.pageNumber, this.pageSize, this.specificUserId()));
    else {
      await firstValueFrom(this.postService.getLikedPostsForSpecificUser(this.pageNumber, this.pageSize, this.specificUserId()));
    }


    const paginatedResult = this.postService.paginatedForSpecificUser();
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

  sanitizeHtmlContent(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
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

  onWindowScroll(): void {
    if (!this.hasMorePosts || this.loading()) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const scrollThreshold = documentHeight - windowHeight * 1.2;

    if (scrollTop >= scrollThreshold) {
      if (this.pageNumber < this.totalPages) {
        this.pageNumber++;
        this.loadPosts();
      } else {
        this.hasMorePosts = false;
      }
    }
  }
}
