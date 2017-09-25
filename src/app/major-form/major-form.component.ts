import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade_in.animation';

@Component({
  selector: 'app-major-form',
  templateUrl: './major-form.component.html',
  styleUrls: ['./major-form.component.css'],
  animations: [fadeInAnimation]
})

export class MajorFormComponent implements OnInit {
  
    successMessage: string;
    errorMessage: string;
  
    majorData;
  
    majorForm: NgForm;
    @ViewChild('majorForm') currentForm: NgForm;

    getRecordForEdit(){
      this.route.params
        .switchMap((params: Params) => this.dataService.getRecord("major", +params['id']))
        .subscribe(major => this.majorData = major);
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
  
    }
  
    saveMajor(major: NgForm){
      if(typeof major.value.major_id === "number"){
        this.dataService.editRecord("major", major.value, major.value.major_id)
            .subscribe(
              major => this.successMessage = "Record updated succesfully",
              error =>  this.errorMessage = <any>error);
      }else{
        this.dataService.addRecord("major", major.value)
            .subscribe(
              major => this.successMessage = "Record added succesfully",
              error =>  this.errorMessage = <any>error);
              this.majorData = {};
      }
  
    }

    ngAfterViewChecked() {
      this.formChanged();
    }
  
    formChanged() {
      //if the form didn't change then do nothing
      if (this.currentForm === this.majorForm) { return; }
      //set the form to the current form for comparison
      this.majorForm = this.currentForm;
      //subscribe to form changes and send the changes to the onValueChanged method
      this.majorForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    }
  
    onValueChanged(data?: any) {
      let form = this.majorForm.form;
  
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
      'major': '',
      'sat': '',
    };
  
    validationMessages = {
      'major': {
        'required':  'Major is required.',
        'maxlength': 'Major cannot be greater than 30 characters'
      },
      'sat': {
        'pattern': 'Score must be between 400 and 1600.',
        'maxlength': 'Score cannot be more than 4 characters.',
        'required':  'Minimum SAT score is required.',
      }
    };
  
  }
  
