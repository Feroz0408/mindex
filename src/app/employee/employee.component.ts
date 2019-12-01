import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Employee } from "../employee";
import { MyDialogComponent } from "./my-dialog/my-dialog.component";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"]
})
export class EmployeeComponent {
  deletedCheck: boolean;
  @Input() employee;
  @Output() passDataToParent = new EventEmitter<number>();

  constructor(private dialog: MatDialog) {}

  openDialog(reporter, editDelete): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: { ...reporter, popUpCheck: editDelete }
    });

    // tslint:disable-next-line: no-unused-expression
    dialogRef.afterClosed().subscribe(result => {
      if (result.isDeleted === "deleted") {
        delete result.popUpCheck;
        this.passDataToParent.emit(result);
      } else if (result.isEdited === "edited") {
        delete result.popUpCheck;
        this.passDataToParent.emit(result);
      }
      setTimeout(() => this.dialog.closeAll(), 2000);
    });
  }
}
