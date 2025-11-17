import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { Sidebar } from "../sidebar/sidebar";
import { HttpClient } from '@angular/common/http';

declare const $: any;

@Component({
  selector: 'app-mahasiswa',
  imports: [RouterModule, Header, Footer, Sidebar],
  templateUrl: './mahasiswa.html',
  styleUrl: './mahasiswa.css',
})
export class Mahasiswa implements AfterViewInit {
  data : any;
  table1 : any;

  constructor(private httpclient: HttpClient) { }

  ngAfterViewInit(): void {
    this.table1 = $('#table1').DataTable();

    this.bindMahasiswa();
  }

  bindMahasiswa(){
    this.httpclient.get<any>('https://stmikpontianak.cloud/011100862/tampilMahasiswa.php').subscribe((data: any)=>{
      console.table(data);
      this.table1.clear();

      data.forEach((element: any) => {
        var tempatTanggalLahir = element.TempatLahir + ', ' + element.TanggalLahir;

        const jenisKelaminFormatted = element.JenisKelamin + " " + (
          (element.JenisKelamin === "Perempuan" || element.jenisKelamin === "Perempuann") ?
          "<i class='fas fa-venus text-danger'></i>" :
          (element.JenisKelamin != "undefined") ? 
            "<i class='fas fa-mars text-primary'></i>" : " "
          );

          var row = [
            element.NIM, element.Nama,
            jenisKelaminFormatted,
            tempatTanggalLahir,
            element.JP,
            element.Alamat,
            element.StatusNikah,
            element.TahunMasuk
          ]
        
        this.table1.row.add(row);
      });

      this.table1.draw(false);
    });
  }
}
