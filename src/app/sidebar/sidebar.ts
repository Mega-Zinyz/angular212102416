import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  imports: [ RouterModule ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit, AfterViewInit {
  @Input() moduleName: string = "";
  username:string="";
  _header =document.querySelector('.main-header') as HTMLElement;

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.username = this.cookieService.get("userId");

    const saved = localStorage.getItem('adminlte-theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');

      if (this._header) {
        this._header.classList.remove('navbar-white', 'navbar-light');
        this._header.classList.add('navbar-dark', 'navbar-primary');
      }
    } else {
      if (this._header) {
        this._header.classList.remove('navbar-dark', 'navbar-primary');
        this._header.classList.add('navbar-white', 'navbar-light');
      }
    }
  }

  toggleTheme(): void {
    const isDark = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('dark-mode');

    if (this._header) {
      if (!isDark) {
        this._header.classList.remove('navbar-white', 'navbar-light');
        this._header.classList.add('navbar-dark', 'navbar-primary');
      } else {
        this._header.classList.remove('navbar-dark', 'navbar-primary');
        this._header.classList.add('navbar-white', 'navbar-light');
      }
    }
    localStorage.setItem('adminlte-theme', isDark ? 'dark' : 'light');
  }

  ngAfterViewInit(): void {
    const w = window as any;
    const $ = w.$ || (w as any).jQuery;
    if (!$) return;

    // Initialize AdminLTE Treeview on elements with data-widget="treeview"
    if ($.fn && typeof $.fn.Treeview === 'function') {
      try {
        $.each($('[data-widget="treeview"]'), function(i: number, el: any) {
          $(el).Treeview('init');
        });
      } catch (e) {
        // ignore
      }
    }

    // Initialize OverlayScrollbars for the sidebar if plugin available
    if ($.fn && typeof $.fn.overlayScrollbars === 'function') {
      try {
        $('.main-sidebar .sidebar').each(function(this: any) {
          const $el = $(this);
          // avoid double-init
          if (!$el.data('__overlayScrollbars__')) {
            $el.overlayScrollbars({
              className: 'os-theme-light',
              sizeAutoCapable: true,
              scrollbars: { autoHide: 'leave', clickScrolling: true }
            });
          }
        });
      } catch (e) {
        // ignore
      }
    }
  }
}
