import { ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { BrowserModule } from '@angular/platform-browser';
import { NavBarLinks } from 'src/app/models/nav-bar-links';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButtonToggleModule, FormsModule, BrowserModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() links: NavBarLinks[] = [];
  @Output() newLinkEvent: EventEmitter<number> = new EventEmitter<number>();
  selectedButton: string = '';

  constructor() {}

  ngOnInit(): void {
    this.checkPreviousLink();
  }

  checkPreviousLink() {
    let getSession = sessionStorage.getItem('selectedLink');
    if (getSession) {
      let session = JSON.parse(getSession);
      this.selectedButton = session.id;
      this.changeLink(session);
    } else {
      sessionStorage.setItem('selectedLink', JSON.stringify(this.links[0]));
      this.selectedButton = this.links[0].id;
      this.changeLink(this.links[0]);
    }
  }

  changeLink(link: NavBarLinks): void {
    sessionStorage.setItem('selectedLink', JSON.stringify(link));
      this.newLinkEvent.emit(link.leagueId);

  }
}
