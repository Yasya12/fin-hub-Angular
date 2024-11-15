import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrl: './try.component.css'
})
export class TryComponent implements OnInit{
    ngOnInit(): void {
        console.log("loaded");
    }

}
