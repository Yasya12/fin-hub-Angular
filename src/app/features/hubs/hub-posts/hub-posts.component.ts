import { Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { PostService } from '../../../shared/services/post.service';
import { firstValueFrom } from 'rxjs';
import { Post } from '../../home/models/post.interface';
import { PostDetailStore } from '../../post-detail/stores/post-detail/post-detail.store';
import { LikeService } from '../../../shared/services/like.service';
import { ScrollService } from '../../../shared/services/scroll.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ResponseModel } from '../../../shared/models/interfaces/response.model';
import { User } from '../..../../../../core/models/interfaces/user/user.interface';
import { Follow } from '../..../../../followings/models/follow.interface';
import { MemberService } from '../..../../../members/services/member.service';
import { FollowingService } from '../..../../../followings/services/following.service';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../..../../../info-pages/services/contact.service';

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

  // Inputs
  curretnUser: ResponseModel | undefined = undefined;
  currentEmail: string = '';
  hubId = input.required<string>();//
  userCanWritePost = input.required<boolean>();

  // States
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  newPost = signal<Post | undefined>(undefined);
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;

  hasMorePosts = true;

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
    this.curretnUser = this.authService.currentUser();
    this.currentEmail = this.authService.currentUser()!.user.email;

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

  sanitizeHtmlContent(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
  }



  isHovering = false;
  hoverTimeout: any;
  hoveredPostId: string | null = null;
  modalPosition = { top: 0, left: 0 };
  hoveredUser: User | undefined;
  hoverFollowUser: Follow | undefined;
  isFollowing: boolean | undefined;
  showModal: boolean = false;
  openMenuPostId = signal<string | null>(null);
  isDeleteConfirmModalOpen = signal(false);
  postToDeleteId = signal<string | null>(null);
  isReportModalOpen = signal(false);
  reportingPostId = signal<string | null>(null);

  reportReasons = [
    'Спам',
    'Мова ворожнечі',
    'Дезінформація',
    'Переслідування',
    'Контент відвертого характеру',
    'Шахрайство',
    'Інше'
  ];

  @ViewChild('postMenu') postMenu!: ElementRef;


  private readonly memberService = inject(MemberService);
  followingService = inject(FollowingService);
  toastr = inject(ToastrService);
  contactService = inject(ContactService);

  goToUserProfile(event: Event, userName: string): void {
    event.stopPropagation();
    this.router.navigate(['/member', userName]);
  }

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

  checkIfFollows(id: string) {
    this.followingService.isFollowingUser(id).subscribe((result) => {
      this.isFollowing = result;
    })
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

  onModalClick(event: MouseEvent) {
    this.goToUserProfile(event, this.hoveredUser!.username);
    event.stopPropagation();
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

  writeToUser(username: string): void {
    this.router.navigate(['/messages/chats', username]);
  }

  togglePostMenu(post: Post, event: MouseEvent) {
    event.stopPropagation();
    this.loadHoveredUser(post.userName);

    if (this.openMenuPostId() === post.id) {
      this.openMenuPostId.set(null);
    } else {
      this.openMenuPostId.set(post.id);
    }
  }

  sharePost(postId: string, event: MouseEvent) {
    event.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/home/post/${postId}`);
    this.toastr.success('Посилання на пост скопійовано!', 'Успішно');
    this.openMenuPostId.set(null);
  }

  deletePost(postId: string, event: MouseEvent) {
    event.stopPropagation();
    this.postToDeleteId.set(postId);
    this.isDeleteConfirmModalOpen.set(true);
    this.openMenuPostId.set(null);
  }

  reportPost(postId: string, event: MouseEvent) {
    event.stopPropagation();
    this.openMenuPostId.set(null);
    this.reportingPostId.set(postId);
    this.isReportModalOpen.set(true);
  }

  closeReportModal() {
    this.isReportModalOpen.set(false);
    this.reportingPostId.set(null);
  }

  submitReport(reason: string) {
    const postId = this.reportingPostId();
    if (!postId) return;

    this.contactService.reportPost(postId, reason).subscribe({
      next: () => {
        this.toastr.success('Скаргу надіслано успішно!', 'Успіх');
        this.closeReportModal();
      },
      error: () => {
        this.toastr.error('Не вдалося надіслати скаргу. Спробуйте пізніше.', 'Помилка');
        this.closeReportModal();
      }
    });
  }

  closeDeleteConfirmModal() {
    this.isDeleteConfirmModalOpen.set(false);
    this.postToDeleteId.set(null);
  }

  confirmDelete() {
    const postId = this.postToDeleteId();
    if (!postId) {
      return;
    }

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.toastr.success('Пост успішно видалено!', 'Успіх');

        this.posts.update(currentPosts =>
          currentPosts.filter(post => post.id !== postId)
        );

        this.closeDeleteConfirmModal();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.toastr.error('Не вдалося видалити пост. Спробуйте пізніше.', 'Помилка');
        this.closeDeleteConfirmModal();
      }
    });
  }
}
