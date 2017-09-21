import { Component, OnInit,Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'

@Component({
  selector: 'app-klass',
  templateUrl: './klass.component.html',
  styleUrls: ['./klass.component.css']
})
export class KlassComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  klasses: any[];
  mode = 'Observable';
 
  constructor (private dataService: DataService, public dialog: MdDialog) {}
 
  ngOnInit() { this.getKlasses(); }
 
  getKlasses() {
    this.dataService.getRecords("class")
      .subscribe(
        klasses => this.klasses = klasses,
        error =>  this.errorMessage = <any>error);
  }

  deleteKlass(id:number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dataService.deleteRecord("class", id)
          .subscribe(
            klass => {this.successMessage = "Record(s) deleted succesfully"; this.getKlasses(); },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

}
