import { Component, Input } from '@angular/core';

import { StudentComponent } from './student/student.component';
import { fadeInAnimation } from './animations/fade_in.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation]
})
export class AppComponent {
  @Input() erroMessage: string;
}
