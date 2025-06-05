import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Post } from '../../models/post.interface';

import { LikeService } from '../../../../shared/services/like.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { PostDetailStore } from '../../../post-detail/stores/post-detail/post-detail.store';
import { firstValueFrom } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { User } from '../../../../core/models/interfaces/user/user.interface';
import { MemberService } from '../../../members/services/member.service';
import { FollowingService } from '../../../followings/services/following.service';
import { Follow } from '../../../followings/models/follow.interface';
import { ToastrService } from 'ngx-toastr';
import { PostService } from '../../../../shared/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
  standalone: false,
  providers: [PostDetailStore],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(10px)'
      })),
      transition('hidden => visible', [
        animate('400ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('400ms ease-in')
      ])
    ])
  ]
})
export class PostsComponent implements OnInit, AfterViewInit {
  // Services
  private readonly postService = inject(PostService);
  private readonly likeService = inject(LikeService);
  private readonly router = inject(Router);
  private readonly memberService = inject(MemberService);

  toastr = inject(ToastrService);


  followingService = inject(FollowingService);

  //Stores
  posrDetailStore = inject(PostDetailStore); //TODO: write a store for the auth and dont use the post detail store here

  // Inputs
  currentUser = input.required<ResponseModel>();

  // States
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  newPost = signal<Post | undefined>(undefined);
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  hasMorePosts = true;
  showModal: boolean = false;
  hoveredPostId: string | null = null;
  modalPosition = { top: 0, left: 0 };
  hoveredUser: User | undefined;
  hoverFollowUser: Follow | undefined;
  isFollowing: boolean | undefined;

  //effects
  myEffect = effect(
    () => {
      const post = this.newPost();
      if (post && typeof post === 'object') {

        this.posts.update((posts) => [post, ...posts]);
      }
    },
    { allowSignalWrites: true }
  );

  sideBarPostAddEffect = effect(() => {
    const post = this.postService.newPost();
    if (post) {
      this.posts.update((posts) => [post, ...posts]);
      this.postService.reset(); // очищаємо після додавання
    }
  },
    { allowSignalWrites: true });

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadPosts();

    window.addEventListener('scroll', this.onWindowScroll.bind(this));
  }

  ngAfterViewInit(): void {
    if (!this.postService.paginatedResult()) {
      this.loadPosts();
    }
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

  //modal
  isHovering = false;
  hoverTimeout: any;

  showUserModal(post: Post, container: HTMLElement): void {
    this.loadHoveredUser(post.userName);

    this.hoveredPostId = post.id;
    this.showModal = true;
    this.isHovering = true;

    const rect = container.getBoundingClientRect();

    this.modalPosition = {
      top: rect.top + window.scrollY + rect.height + 5,
      left: rect.left + window.scrollX,
    };
  }

  loadHoveredUser(username: string) {
    this.memberService.getUserByUsername(username).subscribe((user) => {
      this.hoveredUser = user;
      this.checkIfFollows(user.id);
    })
  }

  // loadHoverdFollowUser(id: string) {
  //   this.followingService.getFollowById(id).subscribe((user) => {
  //     this.hoverFollowUser = user;
  //   })
  // }

  onModalClick(event: MouseEvent) {
    this.goToUserProfile(event, this.hoveredUser!.username);
    event.stopPropagation();
  }

  hideUserModalWithDelay() {
    this.isHovering = false;

    this.hoverTimeout = setTimeout(() => {
      if (!this.isHovering) {
        this.showModal = false;
        this.hoveredPostId = '';
      }
    }, 300); // 200 мс — можна більше/менше
  }

  cancelHideModal() {
    this.isHovering = true;
    clearTimeout(this.hoverTimeout);
  }

  checkIfFollows(id: string) {
    this.followingService.isFollowingUser(id).subscribe((result) => {
      this.isFollowing = result;
    })
  }

  toggleFollow(userId: string): void {
    if (!this.isFollowing) {
      this.followingService.followUser(userId).subscribe(() => {
        this.isFollowing = !this.isFollowing;
        this.toastr.success(`Now you are following ${this.hoveredUser?.username}`);
      })

    } else {
      this.followingService.unfollow(userId).subscribe(() => {
        this.isFollowing = !this.isFollowing;
        this.toastr.error(`You unfollowd ${this.hoveredUser?.username}`);
      })

    }
  }


  goToUserProfile(event: Event, userName: string): void {
    event.stopPropagation();
    this.router.navigate(['/member', userName]);
  }

  navigateToPost(postId: string) {
    this.router.navigateByUrl(`/home/post/${postId}`);
  }

  addPost(post: Post): void {
    this.newPost.set(post);
  }

  sanitizeHtmlContent(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
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
