import { Component, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-dashboard3',
  imports: [RouterModule, Footer, Header, Sidebar],
  templateUrl: './dashboard3.html',
  styleUrl: './dashboard3.css'
})
export class Dashboard3 {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'dashboard3-page');
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");
    this.renderer.removeClass(this.document.body, 'layout-fixed');
    this.renderer.setAttribute(this.document.body, 'style', 'height: auto; min-height: 100%;');}
    
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'dashboard3-page');
    this.renderer.removeAttribute(this.document.body, 'style');
  }

}
