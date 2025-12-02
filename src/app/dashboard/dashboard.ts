import { Component, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Header, Sidebar, Footer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'dashboard-page');

    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
    this.renderer.removeClass(this.document.body, 'layout-fixed');
    this.renderer.setAttribute(this.document.body, 'style', 'height: auto; min-height: 100%;');}

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'dashboard-page');
    this.renderer.removeAttribute(this.document.body, 'style');
  }
}
