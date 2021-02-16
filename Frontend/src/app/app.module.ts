import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { StudentComponent } from './student/student.component';
import { PrimeComponent } from './prime/prime.component';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    StudentComponent,
    PrimeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
