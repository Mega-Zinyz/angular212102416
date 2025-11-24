import { Component, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit, OnDestroy {
  protected readonly nama = 'Haggai Gershom Harnowo';
  protected readonly nim = '212102416';

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'register-page');

    this.renderer.removeClass(this.document.body, 'sidebar-mini');
    this.renderer.removeClass(this.document.body, 'layout-fixed');

    this.renderer.setAttribute(this.document.body, 'style', 'min-height: 466px;');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'register-page');
    this.renderer.removeAttribute(this.document.body, 'style');
  }
}
