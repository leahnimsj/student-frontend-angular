import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade_in.animation';

@Component({
  selector: 'app-majorclass-form',
  templateUrl: './majorclass-form.component.html',
  styleUrls: ['./majorclass-form.component.css'],
  animations: [fadeInAnimation]
})
export class MajorclassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  majorclass: object;
  majors;
  klasses;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("majorclass", +params['id']))
      .subscribe(majorclass => this.majorclass = majorclass);
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
    this.getClasses();

  }

  getMajors() {
    this.dataService.getRecords("major")
      .subscribe(
        majors => this.majors= majors,
        error =>  this.errorMessage = <any>error);
  }

  getClasses() {
    this.dataService.getRecords("class")
      .subscribe(
        klass => this.klasses= klass,
        error =>  this.errorMessage = <any>error);
  }

  saveMajorclass(majorclass: NgForm){
    if(typeof majorclass.value.major_class_id === "number"){
      this.dataService.editRecord("majorclass", majorclass.value, majorclass.value.major_class_id)
          .subscribe(
            majorclass => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("majorclass", majorclass.value)
          .subscribe(
            student => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.majorclass = {};
    }

  }

}
