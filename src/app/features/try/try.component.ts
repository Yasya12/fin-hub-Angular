import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrl: './try.component.css',
  animations: [
    trigger('expandElement', [
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
    ]),
    trigger('slideUpDown', [
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
    ])
  ]
})
export class TryComponent implements OnInit {
  isLoginVisible = false;

  toggleLogin() {
    this.isLoginVisible = !this.isLoginVisible;
  }

  ngOnInit(): void {
    console.log("loaded");
  }
}