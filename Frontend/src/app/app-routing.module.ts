import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku.component';
import { StudentComponent } from './student/student.component';
import { PrimeComponent } from './prime/prime.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'prime'},
  {path: 'prime', component: PrimeComponent},
  {path: 'sudoku', component: SudokuComponent},
  {path: 'student', component: StudentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
