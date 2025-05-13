import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hub-edit',
  templateUrl: './hub-edit.component.html',
  styleUrl: './hub-edit.component.css'
})
export class HubEditComponent {
  hub = input.required<Hub>();

  toastr = inject(ToastrService)

  mainPhotoPreview?: string;
  backgroundPhotoPreview?: string;
  mainPhotoFile?: File;
  backgroundPhotoFile?: File;

  constructor(private hubService: HubService) { }

  onSave() {
    const formData = new FormData();
    formData.append('name', this.hub().name);
    formData.append('description', this.hub().description);

    if (this.mainPhotoFile) {
      formData.append('mainPhoto', this.mainPhotoFile);
    }

    if (this.backgroundPhotoFile) {
      formData.append('backgroundPhoto', this.backgroundPhotoFile);
    }

    this.hubService.updateHub(this.hub().id, formData).subscribe(
      (response) => {
        this.toastr.success(response.message);
      },
      (error) => {
        console.error('Error updating hub:', error);
      }
    );
  }

  onMainPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.mainPhotoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.mainPhotoPreview = reader.result as string;
        this.hub().mainPhotoUrl = this.mainPhotoPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackgroundPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.backgroundPhotoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.backgroundPhotoPreview = reader.result as string;
        this.hub().backgroundPhotoUrl = this.backgroundPhotoPreview;
      };
      reader.readAsDataURL(file);
    }
  }
}
