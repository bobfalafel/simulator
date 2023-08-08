import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SharesComponent } from './shares/shares.component';
import { TradersComponent } from './traders/traders.component';
import { RequestsComponent } from './requests/requests.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { MakeRequestComponent } from './make-request/make-request.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shares', component: SharesComponent },
  { path: 'traders', component: TradersComponent },
  { path: 'requests', component: RequestsComponent },
  { path: 'my-requests', component: MyRequestsComponent },
  { path: 'make-request', component: MakeRequestComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
