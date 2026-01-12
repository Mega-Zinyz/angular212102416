import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";

declare const $: any;
declare const moment: any;

// Fix Leaflet default icon issue with CDN URLs
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-cuaca',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    TitleCasePipe,
    NgIf,
    Header, 
    Sidebar, 
    Footer,
    RouterModule
  ],
  templateUrl: './cuaca.html',
  styleUrls: ['./cuaca.css'],
})
export class Cuaca implements AfterViewInit {
  // Properties
  private table1: any;
  private map: L.Map | undefined;
  currentWeather: any;
  cityData: any;
  todayDate: string = '';

  // Constructor
  constructor(private renderer: Renderer2, private http: HttpClient) { 
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-close');
    this.renderer.addClass(document.body, 'sidebar-collapsed');
  }

  // Lifecycle Hooks
  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  // Public Methods
  handleEnter(event: any): void {
    const cityName = event.target.value;
    
    if (cityName.length === 0) {
      this.table1.clear();
      this.table1.draw(false);
      return;
    }

    this.getData(cityName);
  }

  kelvinToCelsius(kelvin: number): number {
    return Math.round((kelvin - 273.15) * 100) / 100;
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  }

  calculateDewPoint(temp: number, humidity: number): number {
    const tempC = this.kelvinToCelsius(temp);
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return Math.round(dewPoint * 10) / 10;
  }

  private getData(city: string): void {
    city = encodeURIComponent(city);

    this.http
      .get(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2579d57cd8e6e22856470b726db06e00`)
      .subscribe({
        next: (data: any) => this.handleWeatherData(data),
        error: (error: any) => {
          alert(error.error.message);
          this.table1.clear();
          this.table1.draw(false);
        }
      });
  }

  private initializeDataTable(): void {
    this.table1 = $('#table1').DataTable({
      columnDefs: [
        { 
          targets: 0,
          render: (data: string) => {
            const waktu = moment(data + " UTC ");
            return `${waktu.local().format("YYYY-MM-DD")}<br/>${waktu.local().format("HH:mm")} WIB`;
          },
        },
        {
          targets: 1,
          render: (data: string) => `<img src='${data}' style='filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.7))' />`,
        },
        {
          targets: 2,
          render: (data: string) => {
            const [cuaca, description] = data.split("||");
            return `<strong>${cuaca}</strong><br/>${description}`;
          }
        }
      ]
    });
  }

  private handleWeatherData(data: any): void {
    this.cityData = data.city;

    if (data.list.length > 0) {
      this.currentWeather = data.list[0];
      this.todayDate = moment(this.currentWeather.dt_txt + " UTC ").local().format("YYYY-MM-DD");
      setTimeout(() => this.initMap(this.cityData.coord.lat, this.cityData.coord.lon), 100);
    }

    this.populateDataTable(data.list);
  }

  private populateDataTable(list: any[]): void {
    this.table1.clear();

    list.forEach((element: any) => {
      const weather = element.weather[0];
      const iconUrl = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;
      const cuacaDesktipsi = `${weather.main}||${weather.description}`;
      const tempMin = this.kelvinToCelsius(element.main.temp_min);
      const tempMax = this.kelvinToCelsius(element.main.temp_max);
      const temp = `${tempMin}°C - ${tempMax}°C`;

      this.table1.row.add([element.dt_txt, iconUrl, cuacaDesktipsi, temp]);
    });

    this.table1.draw(false);
  }

  private initMap(lat: number, lon: number): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    setTimeout(() => {
      const container = document.getElementById('map-container');
      if (!container) {
        console.error('Map container not found');
        return;
      }

      const latitude = Number(lat);
      const longitude = Number(lon);

      this.map = L.map('map-container', {
        center: [latitude, longitude],
        zoom: 13,
        scrollWheelZoom: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(`<strong>Lokasi ${this.cityData.name}</strong><br/>Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`)
        .openPopup();

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
          this.map.setView([latitude, longitude], 13);
        }
      }, 100);
    }, 300);
  }
}
