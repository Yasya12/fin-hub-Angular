import { Component, inject, OnInit, signal } from '@angular/core';
import { Hub } from '../models/hub.interface';
import { ActivatedRoute } from '@angular/router';
import { HubService } from '../services/hub.service';

@Component({
  selector: 'app-hub-detail',
  templateUrl: './hub-detail.component.html',
  styleUrls: ['./hub-detail.component.css']
})
export class HubDetailComponent implements OnInit {
  //Services
  private hubService = inject(HubService);
  private readonly route = inject(ActivatedRoute);

  //States
  hub = signal<Hub | undefined>(undefined);

  //hooks
  ngOnInit(): void {
    this.loadHubId();
  }

  //methods
  loadHubId() {
    const hubId = this.route.snapshot.paramMap.get('id');
    if (hubId) {
      this.loadHub(hubId);
    }
  }

  loadHub(hubId: string) {
    this.hubService.getHubById(hubId).subscribe((hub) => {
      this.hub.set(hub);
    });
  }
}
