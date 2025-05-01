import { Component, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { MemberService } from '../services/member.service';
import { AuthStore } from '../../../core/stores/auth-store';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
  providers: [AuthStore]
})
export class MemberEditComponent implements OnInit {
  //Services
  private authService = inject(AuthService)
  private toastr = inject(ToastrService)
  private memberService = inject(MemberService)

  //Stores
  authStore = inject(AuthStore);

  //States
  user = signal<User | undefined>(undefined);
  isDeleteModalOpen = false;

  //HTML Elements
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  //hooks
  ngOnInit(): void {
    this.loadUser();
  }

  //methods
  loadUser() {
    const user = this.authService.currentUser()?.user;
    if (!user) return;
    this.authService.getMember().subscribe({
      next: (u: User) => this.user.set(u)
    })
  }

  updateUser() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully', 'Success');
        this.editForm?.reset(this.user());
      }
    })
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert('The selected file is too large. Maxium size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.memberService.addPhoto(formData).subscribe({
      next: () => {
        this.authService.setCurerntUser();
        this.loadUser();
        this.toastr.success('Profile photo updated successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Error uploading photo', 'Error');
      }
    })
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDeletePhoto() {
    this.isDeleteModalOpen = false;
    this.deletePhoto();
  }

  deletePhoto() {
    this.memberService.deletePhoto().subscribe({
      next: () => {
        this.loadUser();
        this.authService.setCurerntUser();
        this.toastr.success('Profile picture deleted successfully', 'Success');
      }
    })
  }
}
