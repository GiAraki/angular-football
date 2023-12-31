import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandingsLeagueListComponent } from './features/standings-league-list/standings-league-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: StandingsLeagueListComponent,
    data: { showNav: true },
  },
  {
    path: 'list/:id',
    loadComponent: () =>
      import(
        './features/standings-league-detail/standings-league-detail.component'
      ).then((m) => m.StandingsLeagueDetailComponent),
    data: { showNav: false },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
