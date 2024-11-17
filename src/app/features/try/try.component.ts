import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

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
    ])
  ]
})
export class TryComponent implements OnInit{
    ngOnInit(): void {
        console.log("loaded");
    }

}
