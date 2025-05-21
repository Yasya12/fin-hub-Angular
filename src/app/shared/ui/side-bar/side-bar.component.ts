import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Hub } from '../../../features/hubs/models/hub.interface';
import { HubService } from '../../../features/hubs/services/hub.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class SideBarComponent {
  //Services
  private hubService = inject(HubService);
    private readonly router = inject(Router);

  //States
  hubs = signal<Hub[]>([]);

  //hooks
  ngOnInit(): void {
    this.loadHubs();
  }

  //Methods
   loadHubs() {
    this.hubService.getHubs().subscribe({
      next: (hubs) => this.hubs.set(hubs.slice(0, 8)) 
    });
  }

  navigateToHub(hubId: string) {
    this.router.navigateByUrl(`/hubs/${hubId}`);
  }
}
