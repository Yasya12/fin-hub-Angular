import { Component, inject, input, OnInit, output, PLATFORM_ID } from '@angular/core';
import { SinglePost } from '../../models/interfaces/single-post.interface';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrl: './post-view.component.css'
})
export class PostViewComponent implements OnInit {
  // Services
  private readonly platformId = inject(PLATFORM_ID);

  // Inputs 
  post = input<SinglePost>();
  isLiked = input.required<boolean>();

  // Outputs
  toggleLike = output<void>();

  onToggleLike() {
    this.toggleLike.emit();
  }
  // Lifecycle hooks
  ngOnInit(): void {
    this.makeLinksClickable();
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
}
