import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { SliderChangeEvent, SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { GameState } from '../../core/states/game/game.state';
import { select, Store } from '@ngxs/store';
import { LeaveGame } from '../../core/states/game/game.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    IconComponent,
    TranslatePipe,
    DialogComponent,
    SliderModule,
    FormsModule,
    DropdownModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private translate = inject(TranslateService);
  private store = inject(Store);
  visible = signal(false);
  selectedFontSize = signal(16);

  isCurrentGame = select(GameState.isCurrentGame);

  langs = signal<{ label: string, value: string }[]>([]);

  constructor() {
    this.langs.set(this.translate.getLangs().map(lang => ({ label: lang, value: lang })));
  }

  setLang(event: DropdownChangeEvent) {
    this.translate.use(event.value.value);
  }

  setFontSize(event: SliderChangeEvent) {
    document.documentElement.style.setProperty('--root-font-size', `${event.value}px`);
  }

  leaveGame() {
    this.store.dispatch(new LeaveGame()).subscribe(() => {
      this.visible.set(false);
    });
  }
}
