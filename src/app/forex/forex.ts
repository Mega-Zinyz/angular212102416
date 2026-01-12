import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from "../header/header";
import { RouterModule } from '@angular/router';
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { HttpClient } from '@angular/common/http';
import { formatCurrency, formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [RouterModule, Header, Sidebar, Footer, CommonModule],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
})
export class Forex implements AfterViewInit{
  private _table: any;
  currencies: any[] = [];

  constructor(private renderer: Renderer2, private httpclient: HttpClient) {}
  
  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-close');
    this.renderer.addClass(document.body, 'sidebar-collapsed');

    this.bindtable1();
  }

  bindtable1(): void {
    console.log("bindtable1()");

    const ratesurl = "https://openexchangerates.org/api/latest.json?app_id=9e3f53f5afd94f98bb414b16b73300ca";
    const currenciesUrl = "https://openexchangerates.org/api/currencies.json";

    const symbolMap: Record<string,string> = {
      // Major currencies
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF',
      
      // Americas
      CAD: 'C$', MXN: '$', BRL: 'R$', ARS: '$', CLP: '$', COP: '$', PEN: 'S/',
      
      // Asia Pacific
      CNY: '¥', INR: '₹', KRW: '₩', SGD: 'S$', HKD: 'HK$', TWD: 'NT$',
      THB: '฿', IDR: 'Rp', MYR: 'RM', PHP: '₱', VND: '₫', PKR: '₨',
      BDT: '৳', LKR: 'Rs', NPR: 'Rs', AUD: 'A$', NZD: 'NZ$',
      
      // Europe
      RUB: '₽', PLN: 'zł', CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв',
      HRK: 'kn', SEK: 'kr', NOK: 'kr', DKK: 'kr', ISK: 'kr', TRY: '₺',
      UAH: '₴', ILS: '₪',
      
      // Middle East & Africa
      SAR: 'SR', AED: 'د.إ', QAR: 'QR', KWD: 'KD', BHD: 'BD', OMR: 'OMR',
      JOD: 'JD', EGP: 'E£', ZAR: 'R', NGN: '₦', KES: 'KSh', GHS: '₵',
      MAD: 'MAD', TND: 'DT',
      
      // Others
      NIO: 'C$', CRC: '₡', GTQ: 'Q', BOB: 'Bs', UYU: '$U', PYG: '₲'
    };

    // Map currency codes to country codes (ISO 3166-1 alpha-2)
    const countryMap: Record<string, string> = {
      USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', CHF: 'ch',
      CAD: 'ca', MXN: 'mx', BRL: 'br', ARS: 'ar', CLP: 'cl', COP: 'co', PEN: 'pe',
      CNY: 'cn', INR: 'in', KRW: 'kr', SGD: 'sg', HKD: 'hk', TWD: 'tw',
      THB: 'th', IDR: 'id', MYR: 'my', PHP: 'ph', VND: 'vn', PKR: 'pk',
      BDT: 'bd', LKR: 'lk', NPR: 'np', AUD: 'au', NZD: 'nz',
      RUB: 'ru', PLN: 'pl', CZK: 'cz', HUF: 'hu', RON: 'ro', BGN: 'bg',
      HRK: 'hr', SEK: 'se', NOK: 'no', DKK: 'dk', ISK: 'is', TRY: 'tr',
      UAH: 'ua', ILS: 'il',
      SAR: 'sa', AED: 'ae', QAR: 'qa', KWD: 'kw', BHD: 'bh', OMR: 'om',
      JOD: 'jo', EGP: 'eg', ZAR: 'za', NGN: 'ng', KES: 'ke', GHS: 'gh',
      MAD: 'ma', TND: 'tn',
      NIO: 'ni', CRC: 'cr', GTQ: 'gt', BOB: 'bo', UYU: 'uy', PYG: 'py'
    };

    forkJoin({
      currencies: this.httpclient.get<any>(currenciesUrl).pipe(catchError(err => { console.error(err); return of({}); })),
      ratesData: this.httpclient.get<any>(ratesurl).pipe(catchError(err => { console.error(err); return of(null); }))
    }).subscribe(result => {
      const currenciesData = result.currencies || {};
      const data = result.ratesData;
      if (!data || !data.rates) {
        console.error('Rates data missing');
        return;
      }

      const rates = data.rates;
      this.currencies = [];

      const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

      for (const currency in rates) {
        const currencyName = currenciesData[currency] ?? '-';
        const rate = rates.IDR / rates[currency];
        const formattedNumber = nf.format(rate);
        const symbol = symbolMap[currency] ?? currency;
        const countryCode = countryMap[currency] ?? '';

        this.currencies.push({
          code: currency,
          symbol: symbol,
          name: currencyName,
          rate: formattedNumber,
          countryCode: countryCode
        });
      }

      // Initialize DataTable after data is loaded and DOM is updated
      setTimeout(() => {
        if (this._table) {
          this._table.destroy();
        }
        this._table = $('#table1').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          pageLength: 10,
          destroy: true
        });
      }, 100); // Increased timeout to ensure DOM is ready
    }, err => {
      console.error('Failed to load forex data', err);
    });
  }
}
