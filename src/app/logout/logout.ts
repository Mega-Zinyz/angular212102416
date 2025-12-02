import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }
}
