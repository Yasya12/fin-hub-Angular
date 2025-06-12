import { Component, ElementRef, HostListener, inject, input, OnInit, output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { SinglePost } from '../../models/interfaces/single-post.interface';
import { isPlatformBrowser } from '@angular/common';
import { Post } from '../../../home/models/post.interface';
import { PostService } from '../../../../shared/services/post.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ContactService } from '../../../info-pages/services/contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent implements OnInit {
  // Services
  private readonly platformId = inject(PLATFORM_ID);
  postService = inject(PostService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  contactService = inject(ContactService);
  router = inject(Router);

  // Inputs 
  post = input<SinglePost>();
  isLiked = input.required<boolean>();
  currentUsername: string = '';

  // Outputs
  toggleLike = output<void>();

  onToggleLike() {
    this.toggleLike.emit();
  }
  // Lifecycle hooks
  ngOnInit(): void {
    this.currentUsername = this.authService.currentUser()!.user.username;

    this.makeLinksClickable();
  }

  sanitizeHtmlContent(html: string): string {
    return html.replace(/&nbsp;/g, ' ');
  }

  private makeLinksClickable() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.querySelectorAll('a').forEach((link) => {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });
      }, 1);
    }
  }

  openMenuPostId = signal<string | null>(null);

  @ViewChild('postMenu') postMenu!: ElementRef;

  togglePostMenu(post: SinglePost, event: MouseEvent) {
    event.stopPropagation();

    if (this.openMenuPostId() === post.id) {
      this.openMenuPostId.set(null);
    } else {
      this.openMenuPostId.set(post.id);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openMenuPostId() && !this.postMenu?.nativeElement?.contains(event.target)) {
      this.openMenuPostId.set(null);
    }
  }

  // --- Дії з меню ---
  //delete post
  isDeleteConfirmModalOpen = signal(false);
  postToDeleteId = signal<string | null>(null);

  deletePost(postId: string, event: MouseEvent) {
    console.log("delete")
    event.stopPropagation();
    this.postToDeleteId.set(postId);
    this.isDeleteConfirmModalOpen.set(true);
    this.openMenuPostId.set(null);
  }

  confirmDelete() {
    const postId = this.postToDeleteId();
    if (!postId) {
      return;
    }

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.toastr.success('Пост успішно видалено!', 'Успіх');

        this.router.navigate(['/home']);

        // this.posts.update(currentPosts =>
        //   currentPosts.filter(post => post.id !== postId)
        // );

        this.closeDeleteConfirmModal();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.toastr.error('Не вдалося видалити пост. Спробуйте пізніше.', 'Помилка');
        this.closeDeleteConfirmModal();
      }
    });
  }

  closeDeleteConfirmModal() {
    this.isDeleteConfirmModalOpen.set(false);
    this.postToDeleteId.set(null);
  }

  sharePost(postId: string, event: MouseEvent) {
    event.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/home/post/${postId}`);
    this.toastr.success('Посилання на пост скопійовано!', 'Успішно');
    this.openMenuPostId.set(null);
  }

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

}
