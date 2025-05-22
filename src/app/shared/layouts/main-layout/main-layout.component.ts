import { Component } from "@angular/core";
import { AppComponent } from "../../../app.component";
import { RouterOutlet } from "@angular/router";
import { ApartAsideComponent } from "../../../core/ui/apart-aside/apart-aside.component";
import { HeaderComponent } from "../../../core/ui/header/header.component";
import { TickerTapeComponent } from "../../../core/ui/ticker-tape/ticker-tape.component";
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
