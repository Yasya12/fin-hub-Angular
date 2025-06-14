// ОНОВЛЕНО: додано ViewChild та ElementRef
import { Component, ElementRef, inject, input, OnInit, ViewChild, signal, Output, EventEmitter } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';
// НОВЕ: переконайтесь, що FormsModule імпортовано у вашому модулі або компоненті,
// якщо ви використовуєте [(ngModel)]
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hub-edit',
  templateUrl: './hub-edit.component.html',
  styleUrl: './hub-edit.component.css'
})
export class HubEditComponent implements OnInit {
  hub = signal<Hub | undefined>(undefined);
  hubId = input.required<string>();

  ngOnInit(): void {
    this.loadHub(this.hubId());
  }

  toastr = inject(ToastrService);
  router = inject(Router);

  // Ваші існуючі властивості
  mainPhotoPreview?: string;
  backgroundPhotoPreview?: string;
  mainPhotoFile?: File;
  backgroundPhotoFile?: File;

  // НОВЕ: Властивості для зберігання імен файлів для відображення
  mainPhotoFileName: string | null = null;
  backgroundPhotoFileName: string | null = null;

  // НОВЕ: Посилання на приховані input елементи для їх очищення
  @ViewChild('mainPhotoInput') mainPhotoInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('backgroundPhotoInput') backgroundPhotoInputRef!: ElementRef<HTMLInputElement>;
  @Output() saved = new EventEmitter<void>();

  constructor(private hubService: HubService) { }

  onSave() {
    const formData = new FormData();
    // Використовуємо .name і .description з сигналу
    formData.append('name', this.hub()!.name);
    formData.append('description', this.hub()!.description);

    if (this.mainPhotoFile) {
      formData.append('mainPhoto', this.mainPhotoFile);
    }

    if (this.backgroundPhotoFile) {
      formData.append('backgroundPhoto', this.backgroundPhotoFile);
    }

    this.hubService.updateHub(this.hub()!.id, formData).subscribe(
      (response) => {
        this.toastr.success(response.message);
        this.saved.emit();

        this.mainPhotoFile = undefined;
        this.backgroundPhotoFile = undefined;

        this.mainPhotoPreview = undefined;
        this.backgroundPhotoPreview = undefined;

        this.mainPhotoFileName = null;
        this.backgroundPhotoFileName = null;
        // this.router.navigate(['/hubs', this.hubId()], { queryParams: { tab: 'posts' } });
      },
      (error) => {
        console.error('Error updating hub:', error);
      }
    );

    this.loadHub(this.hubId());
  }

  loadHub(hubId: string) {
    this.hubService.getHubById(hubId).subscribe((hub) => {
      this.hub.set(hub);
    });
  }

  // ОНОВЛЕНО: Метод onMainPhotoSelected
  onMainPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mainPhotoFile = file;
      this.mainPhotoFileName = file.name; // НОВЕ: зберігаємо ім'я файлу

      const reader = new FileReader();
      reader.onload = () => {
        this.mainPhotoPreview = reader.result as string;
        // Цей рядок оновлює URL в об'єкті, але може бути зайвим, якщо ви не використовуєте його
        // this.hub()!.mainPhotoUrl = this.mainPhotoPreview; 
      };
      reader.readAsDataURL(file);
    }
  }

  // ОНОВЛЕНО: Метод onBackgroundPhotoSelected
  onBackgroundPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.backgroundPhotoFile = file;
      this.backgroundPhotoFileName = file.name; // НОВЕ: зберігаємо ім'я файлу

      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundPhotoPreview = reader.result as string;
        // this.hub().backgroundPhotoUrl = this.backgroundPhotoPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  // НОВИЙ МЕТОД: Очищення головного фото
  clearMainPhoto(): void {
    this.mainPhotoFile = undefined;
    this.mainPhotoPreview = undefined;
    this.mainPhotoFileName = null;
    // Скидаємо значення самого input елемента
    if (this.mainPhotoInputRef) {
      this.mainPhotoInputRef.nativeElement.value = '';
    }
    // Опціонально: скинути URL в самому об'єкті хаба, якщо він там є
    // this.hub().mainPhotoUrl = 'шлях до фото за замовчуванням або null';
  }

  // НОВИЙ МЕТОД: Очищення фонового фото
  clearBackgroundPhoto(): void {
    this.backgroundPhotoFile = undefined;
    this.backgroundPhotoPreview = undefined;
    this.backgroundPhotoFileName = null;
    // Скидаємо значення самого input елемента
    if (this.backgroundPhotoInputRef) {
      this.backgroundPhotoInputRef.nativeElement.value = '';
    }
    // this.hub().backgroundPhotoUrl = 'шлях до фото за замовчуванням або null';
  }
}