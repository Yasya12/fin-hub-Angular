import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from '../../../core/core.module';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CoreModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}
