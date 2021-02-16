import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UserService } from '../user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {
  i: number;
  j: number;

  second: number = 0;
  sec: string = '00';
  min: string = '000'

  boardSetup: Array<any>;

  initialgame: Array<any> =
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

  level: number = 4;

  newGame: Boolean = false;

  prevState: Array<any> = [];

  timerStop: boolean = false;

  leaderBoard: Array<any> = [];

  leaderForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private _user: UserService) { }

  ngOnInit(): void {
  }

  startGame() {
    this.newGame = true;
    this.startNewGameBoard(this.initialgame, 0, 0);
    this.timer();
  }

  timer() {
    if (this.timerStop) {
      return;
    }
    setTimeout(() => {
      this.second++;
      this.sec = (this.second % 60).toString();
      this.sec = this.sec.padStart(2, '0');
      this.min = (Math.floor(this.second / 60)).toString();
      this.min = this.min.padStart(3, '0');
      this.timer();
    }, 1000);
  }

  setNewGame(level, board) {
    var game =
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var x = Math.random();
        if (x >= 1 / (level * 1.5)) {
          game[i][j] = 1;
          this.initialgame[i][j] = board[i][j];
        }
      }
    }
    this.boardSetup = game;
  }

  startNewGameBoard(grid, row, col) {
    var cell = this.findEmptyCell(grid, row, col);
    row = cell[0];
    col = cell[1];
    if (row == -1) {
      localStorage.setItem('boardValue', grid);
      this.setNewGame(this.level, grid);
      return true;
    }
    var y = Math.ceil(Math.random() * 8);
    var x = Math.ceil(Math.random() * y);
    for (var num = x; num <= 9; num++) {
      if (this.checkMove(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.startNewGameBoard(grid, row, col)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    return false;
  }

  findEmptyCell(grid, row, col) {
    for (; row < 9; col = 0, row++) {
      for (; col < 9; col++) {
        if (grid[row][col] == 0) {
          return [row, col];
        }
      }
    }
    return [-1, -1];
  }

  checkMove(grid, row, col, num) {
    return (this.checkRow(grid, row, num) && this.checkColumn(grid, col, num) && this.checkBox(grid, row, col, num));
  }

  checkRow(grid, row, num) {
    for (var col = 0; col < 9; col++) {
      if (grid[row][col] == num) {
        return false;
      }
    }
    return true;
  }

  checkColumn(grid, col, num) {
    for (var row = 0; row < 9; row++) {
      if (grid[row][col] == num) {
        return false;
      }
    }
    return true;
  }

  checkBox(grid, row, col, num) {
    row = Math.floor(row / 3) * 3;
    col = Math.floor(col / 3) * 3;
    for (var r = 0; r < 3; r++) {
      for (var c = 0; c < 3; c++) {
        if (grid[row + r][col + c] == num) {
          return false;
        }
      }
    }
    return true;
  }

  setNewMove(event, i, j) {
    const oldVal = this.initialgame[i][j];
    const oldState = this.boardSetup[this.i][this.j];
    oldState == 0 ? this.prevState.push([event, i, j, true, oldVal]) : this.prevState.push([event, i, j, false, oldVal]);
    this.checkNewMove(event, i, j);
  }

  checkNewMove(event, i, j) {
    this.boardSetup[this.i][this.j] = '*';
    var allMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var notAllowedMoves = [];
    const row = Math.floor(i / 3) * 3;
    const col = Math.floor(j / 3) * 3;
    for (var x = row; x < row + 3; x++) {
      for (var y = col; y < col + 3; y++) {
        notAllowedMoves.push(this.initialgame[x][y]);
      }
    }
    notAllowedMoves.splice(notAllowedMoves.indexOf(event), 1)
    for (var x = 0; x < 9; x++) {
      notAllowedMoves.push(this.initialgame[x][j])
    }
    notAllowedMoves.splice(notAllowedMoves.indexOf(event), 1)
    for (var x = 0; x < 9; x++) {
      notAllowedMoves.push(this.initialgame[i][x])
    }
    notAllowedMoves.splice(notAllowedMoves.indexOf(event), 1)
    notAllowedMoves.forEach(val => allMoves.includes(val) ? allMoves.splice(allMoves.indexOf(val), 1) : null);
    if (!allMoves.includes(event)) {
      $("#cell_" + i + '_' + j).addClass("redText");
    } else {
      $("#cell_" + i + '_' + j).removeClass("redText");
    }
    return;
  }

  get(num) {
    const oldVal = this.initialgame[this.i][this.j];
    const oldState = this.boardSetup[this.i][this.j];
    oldState == 0 ? this.prevState.push([event, this.i, this.j, true, oldVal]) : this.prevState.push([event, this.i, this.j, false, oldVal]);
    this.initialgame[this.i][this.j] = parseInt(num);
    this.checkNewMove(parseInt(num), this.i, this.j);
  }

  onFocus(i, j) {
    this.i = i;
    this.j = j;
  }

  setNull(i, j) {
    if (this.boardSetup[i][j] == 0) {
      this.initialgame[i][j] = null;
    }
    return true;
  }

  submit() {
    var finalBoard = [];
    var k = 0;
    const val = localStorage.getItem('boardValue').split(',');
    for (var x = 0; x < 9; x++) {
      finalBoard.push([]);
      for (var y = 0; y < 9; y++) {
        finalBoard[x].push(parseInt(val[k]));
        k++;
      }
    }
    if (Boolean(JSON.stringify(this.initialgame) == JSON.stringify(finalBoard))) {
      this.timerStop = true;
      $('#myModal').modal('show');
    }
  }

  hint() {
    const oldVal = this.initialgame[this.i][this.j];
    var finalBoard = [];
    var k = 0;
    const val = localStorage.getItem('boardValue').split(',');
    for (var x = 0; x < 9; x++) {
      finalBoard.push([]);
      for (var y = 0; y < 9; y++) {
        finalBoard[x].push(parseInt(val[k]));
        k++;
      }
    }
    this.boardSetup[this.i][this.j] == 0 ? this.prevState.push([finalBoard[this.i][this.j], this.i, this.j, true, oldVal]) : this.prevState.push([finalBoard[this.i][this.j], this.i, this.j, false, oldVal]);
    this.boardSetup[this.i][this.j] = '*';
    this.initialgame[this.i][this.j] = finalBoard[this.i][this.j];
    this.second = this.second + 300;
    $("#cell_" + this.i + '_' + this.j).removeClass("redText");
  }

  erase() {
    this.initialgame[this.i][this.j] = null;
    this.boardSetup[this.i][this.j] = 0;
  }

  undo() {
    var action = this.prevState.pop();
    if (action) {
      this.initialgame[action[1]][action[2]] = action[4];
      action[3] ? this.boardSetup[action[1]][action[2]] = 0 : this.boardSetup[action[1]][action[2]] = '*';
    }
  }

  restart() {
    window.location.reload();
  }

  fetchLeaderBoard() {
    this._user.fetchLeaderBoard({ level: this.level })
      .subscribe(data => this.addToLeaderBoard(data));
  }

  addToLeaderBoard(data) {
    this.leaderBoard = data;
  }

  saveLeader() {
    this._user.addLeader({ name: this.leaderForm.controls.name.value, email: this.leaderForm.controls.email.value, time: this.second, level: this.level })
      .subscribe(data => { });
    this.fetchLeaderBoard();
  }

  getTime(time) {
    return (Math.floor(time/60) + 'min ' + (time%60) + 'sec');
  }

}
