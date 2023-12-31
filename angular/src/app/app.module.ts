import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SharesComponent } from './shares/shares.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TradersComponent } from './traders/traders.component';
import { RequestsComponent } from './requests/requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { MakeRequestComponent } from './make-request/make-request.component';
import { ShareDetailsComponent } from './share-details/share-details.component';
import { TraderDetailsComponent } from './trader-details/trader-details.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, HomeComponent, SharesComponent, NavbarComponent, TradersComponent, RequestsComponent, MyRequestsComponent, MakeRequestComponent, ShareDetailsComponent, TraderDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
