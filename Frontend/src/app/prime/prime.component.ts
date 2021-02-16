import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prime',
  templateUrl: './prime.component.html',
  styleUrls: ['./prime.component.css']
})
export class PrimeComponent implements OnInit {

  check:String;

  output:Array<any> = [];

  constructor() { }

  ngOnInit(): void {
  }

  checkPrime() {
    this.output = [];
    this.check.split(',').forEach(val => {
      if(val && Number.isInteger(parseInt(val))) {
        this.isPrime(val)?this.output.push(val + ' is a prime number'):this.output.push(val + ' is not a prime number')
      }
    })
  }

  isPrime(no) {
    var num = parseInt(no);
    if(num > 3) {
        for(var i = 2; i<=Math.floor(num**.5); i++) {
            if(num%i==0) {
                return false;
            }
        }
    } else if(num==1) {
        return false;
    } else{
        return true;
    }
    return true;
  }

}