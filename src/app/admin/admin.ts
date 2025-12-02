import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { Sidebar } from '../sidebar/sidebar';
import { Content } from "../content/content";
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [Header, Footer, Sidebar, Content, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // remove page-only classes and ensure admin layout classes
    this.renderer.removeClass(this.document.body, 'login-page');
    this.renderer.removeClass(this.document.body, 'register-page');
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
  }

  ngOnDestroy(): void {
    // cleanup so other routes are not affected
    this.renderer.removeClass(this.document.body, 'sidebar-open');
  }
}
