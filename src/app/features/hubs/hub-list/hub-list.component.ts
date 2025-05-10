import { Component, inject, OnInit, signal } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { HubService } from '../services/hub.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hub-list',
  templateUrl: './hub-list.component.html',
  styleUrl: './hub-list.component.css'
})
export class HubListComponent implements OnInit {
  //Services
  private hubService = inject(HubService);
  private readonly router = inject(Router);

  //States
  hubs = signal<Hub[]>([]);

  //hooks
  ngOnInit(): void {
    this.loadHubs();
  }

  //methods
  loadHubs() {
    this.hubService.getHubs().subscribe({
      next: (hubs) => this.hubs.set(hubs)
    });
  }

  navigateToHub(hubId: string) {
    this.router.navigateByUrl(`/hubs/${hubId}`);
  }
}
