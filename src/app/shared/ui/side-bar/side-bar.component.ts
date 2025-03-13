import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class SideBarComponent {
  categories = [
    "Health",
    "Computer Science",
    "Marketing",
    "Finance",
    "Philosophy",
    "Economics",
    "Fashion and Style",
    "Science"
  ];
}
