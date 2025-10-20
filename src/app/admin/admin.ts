import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { Sidebar } from '../sidebar/sidebar';
import { Content } from "../content/content";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [Header, Footer, Sidebar, Content, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

}
