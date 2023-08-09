import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-share-details',
  templateUrl: './share-details.component.html', // Replace with the actual template URL
  styleUrls: ['./share-details.component.css'], // Replace with the actual styles
})
export class ShareDetailsComponent implements OnInit {
  traders: any[] = [];
  shareId: string = '';
  shareDetails: any = {
    buyRequests: [],
    sellRequests: [],
    share: {},
    lastCompletedTrades: [],
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Retrieve the share ID from the route parameter
    this.shareId = String(this.route.snapshot.paramMap.get('id'));

    // Fetch share details using the share ID
    this.http
      .get<any>(`http://localhost:3000/shares/${this.shareId}`, {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.shareDetails = data;

        // Fetch traders to build owner names
        this.http
          .get<any>(`http://localhost:3000/traders`, {
            withCredentials: true,
          })
          .subscribe(
            (tradersData) => {
              this.traders = tradersData;

              // Replace owner IDs with owner names
              this.shareDetails.buyRequests.forEach(
                (buyRequest: { owner: any; ownerName: any }) => {
                  const ownerTrader = this.traders.find(
                    (trader) => trader.id === buyRequest.owner
                  );
                  if (ownerTrader) {
                    buyRequest.ownerName = ownerTrader.name;
                  }
                }
              );

              this.shareDetails.sellRequests.forEach(
                (sellRequest: { owner: any; ownerName: any }) => {
                  const ownerTrader = this.traders.find(
                    (trader) => trader.id === sellRequest.owner
                  );
                  if (ownerTrader) {
                    sellRequest.ownerName = ownerTrader.name;
                  }
                }
              );
            },
            (error) => {
              console.error('Error fetching traders:', error);
            }
          );
      });
  }
}
