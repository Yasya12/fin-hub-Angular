import { ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
import { HubJoinRequest } from '../models/hubJoinRequestDto';
import { HubService } from '../services/hub.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hub-join-request',
  templateUrl: './hub-join-request.component.html',
  styleUrl: './hub-join-request.component.css'
})
export class HubJoinRequestComponent implements OnInit {
  hubId = input.required<string>();
  private toastr = inject(ToastrService);
  requests: HubJoinRequest[] = [];

  constructor(private hubService: HubService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadRequests();
  }

  loadRequests(): void {
    this.hubService.getJoinRequests(this.hubId()).subscribe((data) => {
      this.requests = data;
    });
  }

  approveRequest(request: HubJoinRequest): void {
    this.hubService.approveRequest(request.id).subscribe({
      next: () => {
        request.status = "Approved";
        this.cdr.markForCheck();
        this.toastr.success('Request approved!');
      },
      error: (err) => {
        this.toastr.error('Failed to approve request.');
      },
    });
  }

  denyRequest(request: HubJoinRequest): void {
    this.hubService.denyRequest(request.id).subscribe({
      next: () => {
        request.status = "Denied";
        this.cdr.markForCheck();
        this.toastr.warning('Request denied.');
      },
      error: () => {
        this.toastr.error('Failed to deny request.');
      },
    });
  }

  private updateRequestStatus(id: string, status: string): void {
    const request = this.requests.find((r) => r.id === id);
    if (request) {
      request.status = status;
    }
  }

  modalContent: string | null = null;
  showModal = false;

  openModal(content: string) {
    this.modalContent = content;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}