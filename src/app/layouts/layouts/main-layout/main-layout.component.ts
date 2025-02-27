import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from '../../../core/core.module';
import { HomeModule } from '../../../features/home/home.module';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CoreModule, HomeModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}
