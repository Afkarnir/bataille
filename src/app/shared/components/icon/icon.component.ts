import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {
  filled = input<boolean, string>(false, { transform: booleanAttribute });
}
