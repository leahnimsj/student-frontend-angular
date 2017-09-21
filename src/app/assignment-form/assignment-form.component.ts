import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css']
})
export class AssignmentFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  assignment: object;
  students;
  grades;
  klasses;

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

}
