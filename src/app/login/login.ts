import { Component, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

declare const $: any;

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, private router: Router, private coockieService: CookieService, private httpClient: HttpClient) {}
  
  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'login-page');

    this.renderer.removeClass(this.document.body, 'sidebar-mini');
    this.renderer.removeClass(this.document.body, 'layout-fixed');

    this.renderer.setAttribute(this.document.body, 'style', 'min-height: 466px;');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'login-page');
    this.renderer.removeAttribute(this.document.body, 'style');
  }

  showPeringatanModal(message: string): void {
    $("#peringatanModal").modal();
    $("#pm_message").html(message);
  }

  signIn(): void {
  console.log("signIn()")

  var userId = $("#idText").val();
  userId = encodeURIComponent(userId);

  var password = $("#passwordText").val();
  password = encodeURIComponent(password);

  var url = "https://stmikpontianak.cloud/011100862/login.php"+ 
    "?id=" + userId + 
    "&password=" + password;
  console.log("url:" + url);
  
  this.httpClient.get(url).subscribe((data: any) => {
    console.log(data);
    var row = data[0];

    if (row.idCount != "1") {
      this.showPeringatanModal("User Id atau Password salah");
      return;
    }

    this.coockieService.set("userId", userId);
    console.log("Session data berhasil dibuat:");
    this.router.navigate(["/admin"]);
    });
  }
}
