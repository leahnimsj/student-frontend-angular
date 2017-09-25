import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from '../animations/fade_in.animation';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css'],
  animations: [fadeInAnimation]
})
export class AssignmentFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  assignment: object;
  students;
  grades;
  klasses;

  assignmentForm: NgForm;
  @ViewChild('assignmentForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("assignment", +params['id']))
      .subscribe(assignment => this.assignment = assignment);
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
    this.getStudents();
    this.getGrades();
    this.getClasses();

  }

  getStudents() {
    this.dataService.getRecords("student")
      .subscribe(
        students => this.students= students,
        error =>  this.errorMessage = <any>error);
  }

  getGrades() {
    this.dataService.getRecords("grade")
      .subscribe(
        grade => this.grades= grade,
        error =>  this.errorMessage = <any>error);
  }

  getClasses() {
    this.dataService.getRecords("class")
      .subscribe(
        klass => this.klasses= klass,
        error =>  this.errorMessage = <any>error);
  }

  saveAssignment(assignment: NgForm){
    if(typeof assignment.value.assignment_id === "number"){
      this.dataService.editRecord("assignment", assignment.value, assignment.value.assignment_id)
          .subscribe(
            assignment => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("assignment", assignment.value)
          .subscribe(
            assignment => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.assignment = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.assignmentForm) { return; }
    //set the form to the current form for comparison
    this.assignmentForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.assignmentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    let form = this.assignmentForm.form;

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
    'assignment_nbr': ''
  };

  validationMessages = {
    'assignment_nbr': {
      'required':  'Assignment Number is required.' 
    }
  };

}
