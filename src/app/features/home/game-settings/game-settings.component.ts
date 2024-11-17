import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { PlayerState } from '../../../core/states/player/player.state';
import { select, Store } from '@ngxs/store';
import { CreatePlayer } from '../../../core/states/player/player.actions';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Player } from '../../../core/models/player';
import { CreateGame } from '../../../core/states/game/game.actions';
import { GameState } from '../../../core/states/game/game.state';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../../../core/models/api';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { DividerModule } from 'primeng/divider';

type PlayerListForm = {
  player: number;
  new: string;
}

@Component({
  selector: 'app-game-settings',
  standalone: true,
  imports: [
    DropdownModule,
    TranslatePipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    IconComponent,
    DividerModule,
  ],
  templateUrl: './game-settings.component.html',
  styleUrl: './game-settings.component.scss'
})
export class GameSettingsComponent {
  private store = inject(Store);
  private players = select(PlayerState.getPlayers);
  private formBuilder = inject(FormBuilder);
  private translate = inject(TranslateService);
  private newPlayerLabel = toSignal(this.translate.stream('player.new'));

  loading = select(GameState.getLoading);
  errorMessage = signal<string | null>(null);

  form = this.formBuilder.group({
    list: this.formBuilder.array<PlayerListForm>([])
  });
  
  signalForm = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  selectablePlayers = computed(() => [
    {
      name: this.newPlayerLabel(),
      id: -1,
    },
    ...this.players()
      .map(player => ({
        ...player,
        disabled: !this.signalForm().list?.findIndex((listPlayer: PlayerListForm | null) => listPlayer?.player === player.id)
      }))
  ]);
  
  playerCount = signal(2);
  onCancel = output();

  constructor() {
    effect(() => {
      const listLength = this.list.length;
      if(listLength < this.playerCount()) {
        for (let i = 0; i < this.playerCount() - listLength; i++) {
          this.list.push(this.formBuilder.group({
            player: [null, Validators.required],
            new: ['']
          }));
        }
      }
    });
  }

  onSubmit() {
    if(this.form.invalid) {
      this.markAllAsDirty();
      return;
    }

    this.form.disable();

    const newPlayers: Partial<Player>[] = this.list.value
      .filter((player: PlayerListForm) => player.player === -1)
      .map((player: PlayerListForm) => ({ name: player.new }) as Player);
    
    const selectedPlayers: Partial<Player>[] = this.list.value
      .filter((player: PlayerListForm) => player.player !== -1)
      .map((playerForm: PlayerListForm) => ({ id: playerForm.player }));
    
    this.store.dispatch(new CreateGame([...selectedPlayers, ...newPlayers])).pipe(
      catchError((error: ApiError) => {
        // TODO better translation
        this.errorMessage.set(error.message);
        this.form.enable();
        return throwError(() => error);
      })
    ).subscribe();
  }

  cancel() {
    this.form.reset();
    this.form.markAsPristine();
    this.onCancel.emit();
  }

  // Mark all form controls as dirty https://stackoverflow.com/questions/54943261/reactive-forms-mark-dirty-all-controls-in-form-group
  markAllAsDirty() {
    this.list.controls.forEach(group => {
      Object.keys((group as FormGroup).controls).forEach(key => {
        (group as FormGroup).controls[key].markAsDirty();
      })
    });
  }

  setValidators(index: number) {
    if (this.getlistPlayer(index).value === -1) {
      this.getlistNew(index).setValidators(Validators.required);
    } else {
      this.getlistNew(index).clearValidators();
      this.getlistNew(index).setValue('');
      this.getlistNew(index).markAsPristine();
    }
  }

  get list(): FormArray {
    return this.form.get('list') as FormArray;
  }

  getlistPlayer(index: number): FormControl {
    return this.list.controls[index].get('player') as FormControl;
  }

  getlistNew(index: number): FormControl {
    return this.list.controls[index].get('new') as FormControl;
  }
}
