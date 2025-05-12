import { Component, inject, input, OnInit } from '@angular/core';
import { HubService } from '../services/hub.service';
import { HubMemberDto } from '../models/hubMemberDto';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { ToastrService } from 'ngx-toastr';
import { CreateHubJoinRequestDto } from "../models/createHubJoinRequestDto";

@Component({
  selector: 'app-hub-people',
  templateUrl: './hub-people.component.html',
  styleUrl: './hub-people.component.css'
})
export class HubPeopleComponent implements OnInit {
  //Services
  private hubService = inject(HubService);
  toastr = inject(ToastrService)

  //States
  isModalOpen = false;
  hubMembers: HubMemberDto[] | undefined
  groupedMembers: Map<string, HubMemberDto[]> = new Map();
  request: CreateHubJoinRequestDto = {
    hubId: '',
    content: '',
    description: ''
  };
  trustReason: string = '';
  memberReason: string = '';
  trustWordCount: number = 0;
  contributionWordCount: number = 0;

  //inputs
  hubId = input.required<string>();
  currentUser = input.required<User | undefined>();

  //hooks
  ngOnInit(): void {
    this.loadPeople(this.hubId());
  }

  //methods
  loadPeople(hubId: string) {
    this.hubService.getAllHubMembers(hubId).subscribe((members: HubMemberDto[]) => {
      this.hubMembers = members;

      // Групування користувачів у словник за ролями
      this.groupedMembers = members.reduce((acc, member) => {
        if (!acc.has(member.role)) {
          acc.set(member.role, []);
        }
        acc.get(member.role)!.push(member);
        return acc;
      }, new Map<string, HubMemberDto[]>());
    });
  }

  openModal() {
    if (this.currentUser() == undefined) {
      this.toastr.warning("You need to be logged in to became a member of the hub")
    }
    else {
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitRequest() {
    this.request = {
      hubId: this.hubId(),
      content: this.trustReason,
      description: this.memberReason
    };

    this.hubService.requestJoinHub(this.request).subscribe((result) => {
      this.toastr.success(result.message);
    }, (error) => {
      // Try to parse the error message or fallback to the text if JSON is not available
      const errorMessage = error.error?.message || error.error || "Request failed";
      this.toastr.error(errorMessage);
    });

    this.closeModal();
  }


  stopPropagation(event: Event) {
    // Зупинка поширення кліку всередині модального вікна
    event.stopPropagation();
  }

  // Method to update word count dynamically
  updateWordCount(field: 'trust' | 'contribution') {
    const text = field === 'trust' ? this.trustReason : this.memberReason;
    const wordCount = text.trim().split(/\s+/).length;

    if (field === 'trust') {
      this.trustWordCount = wordCount;
    } else {
      this.contributionWordCount = wordCount;
    }
  }
}
