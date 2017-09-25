import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade_in.animation';

@Component({
  selector: 'app-instructor-form',
  templateUrl: './instructor-form.component.html',
  styleUrls: ['./instructor-form.component.css'],
  animations: [fadeInAnimation]
})
export class InstructorFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  instructor: object;
  majors;

  instructorForm: NgForm;
  @ViewChild('instructorForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("instructor", +params['id']))
      .subscribe(instructor => this.instructor = instructor);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });
    this.getMajors();

  }

  getMajors() {
    this.dataService.getRecords("major")
      .subscribe(
        majors => this.majors= majors,
        error =>  this.errorMessage = <any>error);
  }

  saveInstructor(instructor: NgForm){
    if(typeof instructor.value.instructor_id === "number"){
      this.dataService.editRecord("instructor", instructor.value, instructor.value.instructor_id)
          .subscribe(
            instructor => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("instructor", instructor.value)
          .subscribe(
            instructor => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.instructor = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.instructorForm) { return; }
    //set the form to the current form for comparison
    this.instructorForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.instructorForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    let form = this.instructorForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'first_name': '',
    'last_name': '',
    'tenured': ''
  };

  validationMessages = {
    'first_name': {
      'required':  'First name is required.',
      'minlength': 'First name cannot be less than 2 characters.',
      'maxlength': 'First name cannot be more than 30 characters.'
    },
    'last_name': {
      'required':  'Last name is required.',
      'minlength': 'Last name cannot be less than 2 characters.',
      'maxlength': 'Last name cannot be more than 30 characters.'

    },
    'tenured': {
      'min': 'This must either 0 or 1 - 0 = not tenured, 1 = tenured.',
      'max': 'This must either 0 or 1 - 0 = not tenured, 1 = tenured.'
    }
  };


}
