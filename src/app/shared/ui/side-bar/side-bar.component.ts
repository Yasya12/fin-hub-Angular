import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Hub } from '../../../features/hubs/models/hub.interface';
import { HubService } from '../../../features/hubs/services/hub.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class SideBarComponent {

  categories = [
    "Health",
    "Computer Science",
    "Marketing",
    "Finance",
    "Philosophy",
    "Economics",
    "Fashion and Style",
    "Science"
  ];
  //Services
  private hubService = inject(HubService);

  //States
  hubs = signal<Hub[]>([]);

  //hooks
  ngOnInit(): void {
    this.loadHubs();
  }

  //Methods
  loadHubs() {
    this.hubService.getHubs().subscribe({
      next: (hubs) => this.hubs.set(hubs)
    });
  }
}
