import { ChangeDetectorRef, Component, inject, input, OnInit } from '@angular/core';
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
  private cd = inject(ChangeDetectorRef);
  toastr = inject(ToastrService)

  //States
  isModalOpen = false;
  hubMembers: HubMemberDto[] | undefined
  //groupedMembers: Map<string, HubMemberDto[]> = new Map();
  groupedMembers: { role: string; members: HubMemberDto[] }[] = [];
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

  showConfirmModal = false;
  userToDelete: HubMemberDto | undefined;
  confirmDelete(user: any) {
    this.userToDelete = user;
    this.showConfirmModal = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;

    this.hubService.deleteHubMember(this.hubId(), this.userToDelete.username).subscribe(
      () => {
        this.toastr.success('User deleted successfully');

        // Знайти групу за роллю
        const group = this.groupedMembers.find(g => g.role === this.userToDelete!.role);
        if (group) {
          // Видалити користувача з цієї групи
          const index = group.members.findIndex(m => m.username === this.userToDelete!.username);
          if (index !== -1) {
            group.members.splice(index, 1);

            // Якщо група стала порожньою, можеш (опційно) її видалити з масиву
            if (group.members.length === 0) {
              this.groupedMembers = this.groupedMembers.filter(g => g.role !== group.role);
            }
          }
        }

        this.closeConfirmModal();
      },
      (error) => {
        this.toastr.error('Failed to delete user');
        console.error('Error deleting user:', error);
        this.closeModal();
      }
    );
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }




  loadPeople(hubId: string) {
    this.hubService.getAllHubMembers(hubId).subscribe((members: HubMemberDto[]) => {
      this.hubMembers = members;

      // Групування в масив об'єктів { role, members }
      const roleMap = members.reduce((acc, member) => {
        if (!acc[member.role]) {
          acc[member.role] = [];
        }
        acc[member.role].push(member);
        return acc;
      }, {} as { [role: string]: HubMemberDto[] });

      // Перетворення об'єкта в масив
      this.groupedMembers = Object.entries(roleMap).map(([role, members]) => ({
        role,
        members,
      }));

      this.cd.detectChanges(); // Якщо все ще потрібен примусовий detectChanges
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
      content: this.memberReason,
      description: this.trustReason
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
