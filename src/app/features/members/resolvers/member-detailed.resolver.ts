import { ResolveFn } from '@angular/router';
import { User } from '../../../core/models/interfaces/user/user.interface';
import { inject } from '@angular/core';
import { MemberService } from '../services/member.service';

export const memberDetailedResolver: ResolveFn<User | null> = (route, state) => {
  const memberService = inject(MemberService);

  const username = route.paramMap.get('username');
  if (!username) return null;
  
  return memberService.getUserByUsername(username);
};
