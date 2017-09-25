import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade_in.animation';

@Component({
  selector: 'app-klass-form',
  templateUrl: './klass-form.component.html',
  styleUrls: ['./klass-form.component.css'],
  animations: [fadeInAnimation]
})
export class KlassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  klass: object;
  instructors;

  klassForm: NgForm;
  @ViewChild('klassForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("class", +params['id']))
      .subscribe(klass => this.klass = klass);
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
    this.getInstructors();

  }

  getInstructors() {
    this.dataService.getRecords("instructor")
      .subscribe(
        instructors => this.instructors= instructors,
        error =>  this.errorMessage = <any>error);
  }

  saveKlass(klass: NgForm){
    if(typeof klass.value.class_id === "number"){
      this.dataService.editRecord("class", klass.value, klass.value.class_id)
          .subscribe(
            klass => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("class", klass.value)
          .subscribe(
            klass => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.klass = {};
    }

  }

  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    //if the form didn't change then do nothing
    if (this.currentForm === this.klassForm) { return; }
    //set the form to the current form for comparison
    this.klassForm = this.currentForm;
    //subscribe to form changes and send the changes to the onValueChanged method
    this.klassForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data?: any) {
    let form = this.klassForm.form;

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
    'subject': '',
    'course': ''
  };

  validationMessages = {
    'subject': {
      'required':  'Class subject  is required.',
      'maxlength': 'Class subject cannot be greater than 30 characters',
      'minlength': 'Class subject cannot be less than 2 characters'
    },
    'course': {
      'maxlength': 'Course level cannot be greater than 4 digits',

    }
  };

}