import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from "../header/header";
import { RouterModule } from '@angular/router';
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { HttpClient } from '@angular/common/http';
import { formatCurrency, formatDate } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [RouterModule, Header, Sidebar, Footer],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit{
  private _table: any;

  constructor(private renderer: Renderer2, private httpclient: HttpClient) {}
  
  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-close');
    this.renderer.addClass(document.body, 'sidebar-collapsed');

    this._table = $('#table1').DataTable({
      "columnDefs": [
        {
          "targets": 3,
          "className": "text-right"
        }
      ]
    });

    this.bindtable1();
  }

  bindtable1(): void {
    console.log("bindtable1()");

    const ratesurl = "https://openexchangerates.org/api/latest.json?app_id=9e3f53f5afd94f98bb414b16b73300ca";

    const currenciesUrl = "https://openexchangerates.org/api/currencies.json";

    this.httpclient.get(currenciesUrl).subscribe((currencies: any) => {

      this.httpclient.get(ratesurl).subscribe((data: any) => {
        $("#tanggalLabel").html("Data per tanggal " + formatDate(new Date(data.timestamp * 1000), 'medium', 'en-US'));
        const rates = data.rates;
        let index = 1;

        for (const currency in rates) {
          const currencyName = currencies[currency];

          const rate = rates.IDR / rates[currency];

          const formatRate = formatCurrency(rate, "en-US", "", currency);

          console.log(`${currency} - ${currencyName} : ${formatRate}`);

          const row = [index++, currency, currencyName, formatRate];
          this._table.row.add(row);
        }

        this._table.draw(false);
      });
    });
  }
}
