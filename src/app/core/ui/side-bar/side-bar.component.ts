import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  categories = [
    "Інвестстратег",
    "Криптоаналітик",
    "Фінтех-розробник",
    "Ризик-менеджер",
    "Консультант з капіталу",
    "Експерт з фінповедінки"
  ];
}
