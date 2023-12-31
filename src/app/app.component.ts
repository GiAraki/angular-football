import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavBarLinks, NavData } from './models/nav-bar-links';
import { Errors, StandingsResponse } from './models/standings-response';
import { HttpParams } from '@angular/common/http';
import { SportService } from './services/sport.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, ActivationEnd, Params, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  currentYear!: number;
  exibirComponente: boolean = true;

  navBarLinks: NavBarLinks[] = [
    { id: 'englandSelect', leagueId: 39, name: 'England', isSelected: true },
    { id: 'spainSelect', leagueId: 140, name: 'Spain', isSelected: false },
    { id: 'germanySelect', leagueId: 78, name: 'Germany', isSelected: false },
    { id: 'franceSelect', leagueId: 61, name: 'France', isSelected: false },
    { id: 'italySelect', leagueId: 135, name: 'Italy', isSelected: false },
  ];

  constructor(
    private sportService: SportService,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.route.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.exibirComponente = (event.snapshot.data as NavData).showNav
      }

    });
  }


  checkSession(selectedButton: number): void {
    if (selectedButton){
      let getSession = sessionStorage.getItem(selectedButton.toString());
      if(getSession){
        let session = JSON.parse(getSession);
        this.sportService.setSessionDataStandings(session.standings[0])
      }
      else{
        this.getData(selectedButton);
      }
    }
  }

  getData(selectedButton: number): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();

    const params = new HttpParams()
      .set('league', selectedButton)
      .set('season', this.currentYear);

    this.sportService
      .getStandings(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: StandingsResponse) => {
        this.sportService.setSessionDataStandings(data.response[0].league.standings[0]);
        sessionStorage.setItem(
          selectedButton.toString(),
          JSON.stringify(data.response[0].league)
        );
      }),
      (err: Errors) => this._snackBar.open(err.report, 'close');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
