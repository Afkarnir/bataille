import { Component } from '@angular/core';
import { ErrorState } from '../../core/states/error/error.state';
import { select } from '@ngxs/store';
import { ApiError } from '../../core/models/api';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    IconComponent,
    TranslatePipe,
    ButtonModule,
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  error = select<ApiError | null>(ErrorState.getError);

  retry() {
    window.location.reload();
  }
}
