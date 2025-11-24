import { AfterViewInit, Component, OnDestroy, Renderer2 } from '@angular/core';
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
export class Mahasiswa implements AfterViewInit, OnDestroy {
  data : any;
  table1 : any;

  constructor(private httpclient: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, "sidebar-open");
    this.renderer.addClass(document.body, "sidebar-closed");

    // initialize DataTable after view is ready
    if (typeof $ !== 'undefined' && $.fn && $.fn.DataTable) {
      this.table1 = $('#table1').DataTable();
    }

    this.bindMahasiswa();
  }

  ngOnDestroy(): void {
    // clean up DataTable instance to avoid re-init issues when navigating
    try {
      if (this.table1 && typeof $ !== 'undefined' && $.fn && $.fn.DataTable) {
        // destroy the DataTable and remove DOM references
        this.table1.clear();
        this.table1.destroy(true);
      }
    } catch (e) {
      // swallow any errors during destroy to avoid breaking navigation
      console.warn('Error destroying DataTable', e);
    }
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

  showTambahModal(): void {
    $('#tambahModal').modal();
  }

  postRecord(): void {
    var alamat =$('#alamatText').val();
    var jenisKelamin =$('#jenisKelaminSelect').val();
    var jp =$('#jpSelect').val();
    var nama =$('#namaText').val();
    var nim =$('#nimText').val();
    var statusNikah =$('#statusNikahSelect').val();
    var tempatLahir =$('#tempatLahirText').val();
    var tanggalLahir =$('#tanggalLahirText').val();
    var tahunMasuk =$('#tahunMasukText').val();

    if (nim.length == 0) {
      alert("NIM wajib diisi!");
      return;
    }
    if (nama.length == 0) {
      alert("Nama wajib diisi!");
      return;
    }

    if (tempatLahir.length == 0) {
      alert("Tempat Lahir wajib diisi!");
      return;
    }

    if (tanggalLahir.length == 0) {
      alert("Tanggal Lahir wajib diisi!");
      return;
    }

    if (alamat.length == 0) {
      alert("Alamat wajib diisi!");
      return;
    }

    if (tahunMasuk.length == 0) {
      alert("Tahun Masuk wajib diisi!");
      return;
    }

    alamat = encodeURIComponent(alamat);
    jenisKelamin = encodeURIComponent(jenisKelamin);
    jp = encodeURIComponent(jp);
    nama = encodeURIComponent(nama);
    nim = encodeURIComponent(nim);
    statusNikah = encodeURIComponent(statusNikah);
    tahunMasuk = encodeURIComponent(tahunMasuk);
    tempatLahir = encodeURIComponent(tempatLahir);
    tanggalLahir = encodeURIComponent(tanggalLahir);

    var url = 'https://stmikpontianak.cloud/011100862/tambahMahasiswa.php?' +
      "?alamat=" + alamat +
      "&jenisKelamin=" + jenisKelamin +
      "&jp=" + jp +
      "&nama=" + nama +
      "&nim=" + nim +
      "&tahunMasuk=" + tahunMasuk +
      "&statusPernikahan=" + statusNikah +
      "&tempatLahir=" + tempatLahir +
      "&tanggalLahir=" + tanggalLahir;

      this.httpclient.get(url)
      .subscribe((data: any)=>{
        console.table(data);
        alert(data.status + ": " + data.message);

        this.bindMahasiswa();
        $('#tambahModal').modal('hide');
      });
  } 
}
