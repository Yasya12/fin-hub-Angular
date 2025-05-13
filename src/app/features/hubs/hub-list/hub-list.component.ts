import { Component, inject, OnInit, signal } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { HubService } from '../services/hub.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hub-list',
  templateUrl: './hub-list.component.html',
  styleUrls: ['./hub-list.component.css']
})
export class HubListComponent implements OnInit {
  // Services
  private hubService = inject(HubService);
  private readonly router = inject(Router);
  private toastr = inject(ToastrService);

  // States
  hubs = signal<Hub[]>([]);
  isModalOpen = false;
  hubName = '';
  hubDescription = '';
  mainPhoto: File | null = null;
  backgroundPhoto: File | null = null;
  errors = {
    name: '',
    description: ''
  };
  isSubmitted = false;

  // hooks
  ngOnInit(): void {
    this.loadHubs();
  }

  // methods
  loadHubs() {
    this.hubService.getHubs().subscribe({
      next: (hubs) => this.hubs.set(hubs)
    });
  }

  navigateToHub(hubId: string) {
    this.router.navigateByUrl(`/hubs/${hubId}`);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitHub() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const formData = new FormData();
      formData.append('Name', this.hubName);
      formData.append('Description', this.hubDescription);
      if (this.mainPhoto) {
        formData.append('MainPhoto', this.mainPhoto);
      }
      if (this.backgroundPhoto) {
        formData.append('BackgroundPhoto', this.backgroundPhoto);
      }

      this.hubService.createhub(formData).subscribe({
        next: (createdHub) => {
          this.toastr.success('Hub created successfully');
          this.closeModal();
          this.resetForm();

          const currentHubs = this.hubs();
          this.hubs.set([...currentHubs, createdHub]);
        },
        error: (err) => {
          if (err.status === 400 && err.error.message === 'A hub with this name already exists.') {
            this.toastr.error('A hub with this name already exists.');
          } else {
            this.toastr.error('An error occurred while creating the hub.');
          }
        }
      });
    } else {
      console.log('Validation failed', this.errors);
    }
  }

  validateForm(): boolean {
    this.errors = { name: '', description: '' };

    if (this.hubName.trim().length < 3) {
      this.errors.name = 'Name must be at least 3 characters.';
    }

    if (this.hubDescription.trim().length < 5) {
      this.errors.description = 'Description must be at least 5 characters.';
    }

    return !this.errors.name && !this.errors.description;
  }

  resetForm() {
    this.hubName = '';
    this.hubDescription = '';
    this.isSubmitted = false;
    this.errors = { name: '', description: '' };
  }

  // onMainPhotoChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     this.mainPhoto = input.files[0];
  //   }
  // }

  // onBackgroundPhotoChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     this.backgroundPhoto = input.files[0];
  //   }
  // }

  mainPhotoPreview?: string;

  onMainPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.mainPhoto = input.files[0];
    }
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  backgroundPhotoPreview?: string;

  onBackgroundPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.backgroundPhoto = input.files[0];
    }

    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
