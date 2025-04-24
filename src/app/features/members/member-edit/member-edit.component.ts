import { Component, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { MemberService } from '../services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  //Services
  private authService = inject(AuthService)
  private toastr = inject(ToastrService)
  private memberService = inject(MemberService)

  //States
  user = signal<User | undefined>(undefined);

  //HTML Elements
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  //hooks
  ngOnInit(): void {
    this.loadUser();
  }

  //methods
  loadUser() {
    const user = this.authService.currentUser()?.user;
    if(!user) return;
    this.authService.getMember().subscribe({
      next: (u: User) => this.user.set(u)
    })
  }

  updateUser() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully', 'Success');
        this.editForm?.reset(this.user());
      }
    })
  }
}
