import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trader-details',
  templateUrl: './trader-details.component.html',
  styleUrls: ['./trader-details.component.css'],
})
export class TraderDetailsComponent implements OnInit {
  traderId: string = '';
  trader: any;
  shares: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.traderId = String(params.get('id'));
      this.fetchTraderDetails();
    });
  }

  fetchTraderDetails() {
    this.http
      .get<any[]>(`http://localhost:3000/traders/${this.traderId}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.trader = data;

        this.http
          .get<any[]>(`http://localhost:3000/shares`, {
            withCredentials: true,
          })
          .subscribe((data) => {
            this.shares = data;
          });
      });
  }

  getShareNameById(shareId: string): string {
    const share = this.shares.find((s) => s.id === shareId);
    return share ? share.name : 'Unknown Share';
  }
}
