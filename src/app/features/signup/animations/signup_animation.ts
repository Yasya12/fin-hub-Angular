// 🚨 WARNING: These animations are ONLY for SignupComponent!
// Do NOT import this file outside of signup.component.ts
import { animate, state, style, transition, trigger } from '@angular/animations';
export const expandElement = trigger('expandElement', [
  state('void', style({
    height: '0',
    marginTop: '0',
    opacity: '0',
    transform: 'translateY(-20px)'
  })),
  transition(':enter', [
    animate('0.5s ease-out', style({
      height: '*',
      marginTop: '*',
      opacity: '1',
      transform: 'translateY(0)'
    }))
  ])
]);

export const slideUpDown = trigger('slideUpDown', [
  state('down', style({
    transform: 'translateY(100%)',
    display: 'none'
  })),
  state('up', style({
    transform: 'translateY(0)',
    display: 'block'
  })),
  transition('down => up', [
    style({ display: 'block' }),
    animate('300ms ease-in-out')
  ]),
  transition('up => down', [
    animate('300ms ease-in-out')
  ])
]);

export const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    style({ opacity: 1 }),
    animate('0.5s', style({ opacity: 0 }))
  ])
]);