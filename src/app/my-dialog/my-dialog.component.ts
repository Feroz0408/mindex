import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Employee } from "../employee";

@Component({
  selector: "app-my-dialog",
  templateUrl: "./my-dialog.component.html",
  styleUrls: ["./my-dialog.component.css"]
})
export class MyDialogComponent implements OnInit {
  @Input() debug = [];

  constructor(
    public dialogRef: MatDialogRef<MyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  // function to send back the data to Employee Component on click of permanent delete
  deleteEmployee(employee: Employee, isDeleted: string) {
    this.dialogRef.close({ ...employee, isDeleted });
  }

  // function to send back the data to Employee Component on click of save of employee compensation
  updateEmployeeCompensation(
    employee: Employee,
    compensation: number,
    isEdited: string
  ) {
    this.dialogRef.close({
      ...employee,
      compensation: compensation,
      isEdited
    });
  }
}
