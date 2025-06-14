// ОНОВЛЕНО: додано ViewChild та ElementRef
import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
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

  // Previews
  mainPhotoPreview?: string;
  backgroundPhotoPreview?: string;

  // НОВЕ: Властивості для імен файлів та посилання на елементи
  mainPhotoFileName: string | null = null;
  backgroundPhotoFileName: string | null = null;
  @ViewChild('mainPhotoInputModal') mainPhotoInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('backgroundPhotoInputModal') backgroundPhotoInputRef!: ElementRef<HTMLInputElement>;


  ngOnInit(): void {
    this.loadHubs();
  }

  loadHubs() {
    this.hubService.getHubs().subscribe({
      next: (hubs) => this.hubs.set(hubs)
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm(); // Очищуємо форму при закритті
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
          this.toastr.success('Хаб успішно створено');
          this.closeModal(); // closeModal вже викликає resetForm
          const currentHubs = this.hubs();
          this.hubs.set([...currentHubs, createdHub]);
        },
        error: (err) => {
          if (err.status === 400 && err.error.message) {
            this.toastr.error(err.error.message);
          } else {
            this.toastr.error('Виникла помилка при створенні хабу.');
          }
        }
      });
    }
  }

  validateForm(): boolean {
    this.errors = { name: '', description: '' };
    if (this.hubName.trim().length < 3) {
      this.errors.name = 'Назва повинна містити щонайменше 3 символи.';
    }
    if (this.hubDescription.trim().length < 5) {
      this.errors.description = 'Опис повинен містити щонайменше 5 символів.';
    }
    return !this.errors.name && !this.errors.description;
  }

  // ОНОВЛЕНО: resetForm тепер очищує і файли
  resetForm() {
    this.hubName = '';
    this.hubDescription = '';
    this.isSubmitted = false;
    this.errors = { name: '', description: '' };
    this.clearMainPhoto(); // Очищуємо головне фото
    this.clearBackgroundPhoto(); // Очищуємо фонове фото
  }

  // ОНОВЛЕНО: onMainPhotoSelected
  onMainPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mainPhoto = file;
      this.mainPhotoFileName = file.name; // Зберігаємо ім'я файлу

      const reader = new FileReader();
      reader.onload = () => {
        this.mainPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // ОНОВЛЕНО: onBackgroundPhotoSelected
  onBackgroundPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.backgroundPhoto = file;
      this.backgroundPhotoFileName = file.name; // Зберігаємо ім'я файлу

      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundPhotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // НОВИЙ МЕТОД: Очищення головного фото
  clearMainPhoto(): void {
    this.mainPhoto = null;
    this.mainPhotoPreview = undefined;
    this.mainPhotoFileName = null;
    if (this.mainPhotoInputRef) {
      this.mainPhotoInputRef.nativeElement.value = '';
    }
  }

  // НОВИЙ МЕТОД: Очищення фонового фото
  clearBackgroundPhoto(): void {
    this.backgroundPhoto = null;
    this.backgroundPhotoPreview = undefined;
    this.backgroundPhotoFileName = null;
    if (this.backgroundPhotoInputRef) {
      this.backgroundPhotoInputRef.nativeElement.value = '';
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}