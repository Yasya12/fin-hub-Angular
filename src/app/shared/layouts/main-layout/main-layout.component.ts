import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CoreModule } from "../../../core/core.module";
import { CommonModule } from "@angular/common";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  imports: [RouterOutlet, CoreModule,  CommonModule,
    NgxSpinnerModule],
})
export class MainLayoutComponent {}
