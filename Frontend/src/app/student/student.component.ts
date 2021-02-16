import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import * as $ from 'jquery';

declare var $ : any;

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  userForm: FormGroup = new FormGroup({
    studentName: new FormControl(null, Validators.required),
    fatherName: new FormControl(null, Validators.required),
    dob: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    course: new FormControl(null, Validators.required),
    mobile: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    address: new FormControl(null, Validators.required),
    studentID: new FormControl(0)
  })

  url: any;
  imgs: boolean = true;

  studentNo: number = 5;
  count: number;
  
  studentIndex:number;

  studentDetails:any;

  editOn:Boolean = false;

  pageNo: number = 0;
  currentPage: number = 1;

  constructor(private _user: UserService) {
    this._user.countStudent()
    .subscribe(data => {this.addCount(data)});
    this.getStudent(this.studentNo);
  }

  addCount(data) {
    this.count = data;
    this.pageNo = Math.ceil(this.count/5);
  }

  getStudent(no) {
    this.studentNo = no;
    this._user.getStudent({studentNo: this.studentNo})
    .subscribe(data => this.addStudentDetails(data));
  }

  addStudentDetails(data) {
    this.studentDetails = data;
  }

  selectedFile: File = null;
  fileSelect:Boolean = false;
  onFileSelected(event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    this.fileSelect = true;
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(this.selectedFile.type)) {
      this.imgs = false;
      return;
    } else {
      if (this.selectedFile.size > (250 * 1024)) {
        this.imgs = false;
        return;
      }
    }
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = event.target.result;
        this.imgs = true;
      }
    }
  }

  message: String = '';

  ngOnInit(): void {
  }

  submit() {
    this.userForm.markAllAsTouched();
    if(!this.editOn) {
      if (this.userForm.valid && this.url) {
        this.message = '';
        this._user.addStudent(JSON.stringify(this.userForm.value))
          .subscribe(
            data => { this.addPhoto(data) },
            error => { }
          )
      } else {
        this.message = 'All fields are mandatory.'
      }
    } else {
      if(this.userForm.valid) {
        this.message = '';
        this._user.edit(JSON.stringify({body: this.userForm.value, id: this.studentDetails[this.studentIndex]._id}))
        .subscribe(
          data => {
            if(this.selectedFile) {
              this.addPhoto(data);
            } else {
              this.message = "Student Profile edited successfully."
              this.getStudent(this.studentNo);
              this.reset();
            }
          },
          error => {}
        )  
      } else {
        this.message = 'All fields are mandatory.'
      }
    }
  }

  addPhoto(data) {
    if (data._id) {
      this._user.photos(this.selectedFile, data._id)
        .subscribe((event: HttpEvent<any>) => { this.message = "Student added successfully."; this.getStudent(this.studentNo); this.reset(); })
    }
  }

  reset() {
    this.selectedFile = null;
    $("#upload-photo")[0].value = null;
    this.imgs = true;
    this.fileSelect = false;
    this.userForm.reset();
    this.editOn = false;
    this.message = '';
  }

  edit() {
    if(this.studentIndex) {
      this.userForm.controls.studentName.setValue(this.studentDetails[this.studentIndex].studentName)
      this.userForm.controls.fatherName.setValue(this.studentDetails[this.studentIndex].fatherName)
      this.userForm.controls.dob.setValue(this.studentDetails[this.studentIndex].dob)
      this.userForm.controls.gender.setValue(this.studentDetails[this.studentIndex].gender)
      this.userForm.controls.course.setValue(this.studentDetails[this.studentIndex].course)
      this.userForm.controls.mobile.setValue(this.studentDetails[this.studentIndex].mobile)
      this.userForm.controls.email.setValue(this.studentDetails[this.studentIndex].email)
      this.userForm.controls.address.setValue(this.studentDetails[this.studentIndex].address)
      this.userForm.controls.studentID.setValue(this.studentDetails[this.studentIndex].student_id)
      this._user.profilePhoto({photo: this.studentDetails[this.studentIndex].photo})
      .subscribe(data => this.addProfilePhoto(data))
    }
  }

  addProfilePhoto(data) {
    this.url = data.imgurl;
    this.fileSelect = true;
    this.editOn = true;
  }

  delete() {
    if(this.studentIndex) {
      this._user.deleteStudent({id: this.studentDetails[this.studentIndex]._id})
      .subscribe(data => {this.studentDetails.splice(this.studentIndex,1)});
    }
  }

  setStudentNo(no) {
    this.currentPage = no;
    this.studentNo = this.currentPage*5;
    this.getStudent(this.studentNo);
  }

  next() {
    if(this.currentPage < this.pageNo) {
      this.currentPage++;
      this.studentNo = this.currentPage*5;
      this.getStudent(this.studentNo);  
    }
  }

  prev() {
    if(this.currentPage > 1) {
      this.currentPage--;
      this.studentNo = this.currentPage*5;
      this.getStudent(this.studentNo);  
    }
  }

}
