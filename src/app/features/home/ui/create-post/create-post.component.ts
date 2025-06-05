import { Component, EventEmitter, inject, input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CreatePost } from '../../models/create-post';
import { ResponseModel } from '../../../../shared/models/interfaces/response.model';
import { Post } from '../../models/post.interface';
import { ToastrService } from 'ngx-toastr';
import { AuthStore } from '../../../../core/stores/auth-store';
import { PostService } from '../../../../shared/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  standalone: false,
  providers: [AuthStore]
})
export class CreatePostComponent implements OnChanges, OnInit {

  //Stores
  authStore = inject(AuthStore);

  // Services
  private readonly postService = inject(PostService);
  private readonly toastr = inject(ToastrService);

  // Inputs
  currentUser = input<ResponseModel>();
  openModalWindow = input<boolean>();
  isFromSidePannel = input<boolean>();
  hubId = input<string>();

  // States
  isModalOpen = false;
  content = '';
  isInsideModal = false;

  @Output() addPost = new EventEmitter<Post>();
  @Output() addPostModal = new EventEmitter<boolean>();

  ngOnInit() {
    if (this.openModalWindow() == true) {
      this.isModalOpen = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && changes['openModal'].currentValue === true) {
      this.isModalOpen = true;
    }
  }


  openModal() {
    if (!this.currentUser()) {
      this.toastr.warning(
        'You need to log in to create a post.',
        'Authentication Required'
      );
      return;
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.content = '';
    this.addPostModal.emit(false);
  }

  handleContentChange(content: string, images: string[]) {
    const cleanedContent = this.cleanContent(content);
    this.content = cleanedContent; // Ensure the variable is updated correctly
    this.submitPost(images);
  }

  submitPost(images: string[]) {
    const formData = new FormData();

    formData.append('UserEmail', this.currentUser()?.user.email!);
    formData.append('Content', this.content);
    const hubIdValue = this.hubId?.();

    if (hubIdValue) {
      formData.append('HubId', hubIdValue.toString());
    }

    // Convert Base64 images to File and append them
    images.forEach((base64Image, index) => {
      const file = this.base64ToFile(base64Image, `image${index}.png`);
      formData.append('Images', file);
    });

    this.postService.createPost(formData).subscribe((data) => {
      this.closeModal();
      if (this.isFromSidePannel()) {
        this.postService.addPost(this.mapToPost(data));
        this.addPostModal.emit(false);
      }
      else {
        this.addPost.emit(this.mapToPost(data));
      }
    });
  }

  cleanContent(content: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Remove all <img> elements
    doc.querySelectorAll('img').forEach((img) => img.remove());

    // Remove all <span> and <button> elements (if unwanted)
    doc.querySelectorAll('span, button').forEach((element) => element.remove());

    // Remove inline styles from all elements
    doc.querySelectorAll('*').forEach((el) => el.removeAttribute('style'));

    // Return cleaned content without any unwanted tags or styles
    return doc.body.innerHTML.trim();
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  private mapToPost(createPost: CreatePost): Post {
    const transformed = {
      id: createPost.id!,
      userName: this.currentUser()?.user.username!,
      categoryNames: [],
      content: createPost.content,
      createdAt: new Date(),
      profilePictureUrl: this.currentUser()?.user.profilePictureUrl!,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      images: createPost.images,
      hubId: this.hubId ? this.hubId.toString() : undefined
    };

    return transformed;
  }

  onMouseDown(event: MouseEvent) {
    // Check if the click started inside the modal window
    this.isInsideModal =
      (event.target as HTMLElement).closest('app-post-editor') !== null;
  }

  onMouseUp(event: MouseEvent) {
    // If the click ended outside the modal and started outside as well, close the modal
    if (
      !this.isInsideModal &&
      (event.target as HTMLElement).closest('app-post-editor') === null
    ) {
      this.closeModal();
    }
  }
}
