import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/header/header.component';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import translationsFR from "../../public/i18n/fr.json";
import translationsEN from "../../public/i18n/en.json";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private translate = inject(TranslateService);
  private primengConfig = inject(PrimeNGConfig);

  constructor() {
    this.translate.setTranslation('fr', translationsFR);
    this.translate.setTranslation('en', translationsEN);

    this.primengConfig.ripple = true;
    this.primengConfig.zIndex = {
      modal: 110,
      overlay: 90,
      menu: 100,
      tooltip: 110,
    }
  }
}
