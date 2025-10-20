import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  protected readonly nama = 'Haggai Gershom Harnowo';
  protected readonly nim = '212102416';

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'register-page');

    this.renderer.removeClass(document.body, 'sidebar-mini');
    this.renderer.removeClass(document.body, 'layout-fixed');

    this.renderer.setAttribute(document.body, 'style', 'min-height: 466px;');
  }
}
