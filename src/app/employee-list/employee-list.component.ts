import { Component, OnInit } from "@angular/core";
import { catchError, map, reduce } from "rxjs/operators";
import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { MatDialog } from "@angular/material/dialog";
import { MyDialogComponent } from "../my-dialog/my-dialog.component";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  errorMessage: string;
  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService
      .getAll()
      .pipe(
        reduce((emps, e: Employee) => {
          return emps.concat(e);
        }, []),
        map(emps => (this.employees = emps)),
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {});
  }

  deleteEmployee(combinedObject) {
    this.employeeService
      .save(combinedObject.employee)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        const deleted = true;
        this.dialog.open(MyDialogComponent, {
          data: { ...combinedObject.reporter, deleted }
        });
        this.getAllEmployees();
      });
  }

  updateEmployeeCompensation(emp: Employee) {
    this.employeeService
      .save(emp)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        const edited = true;
        this.dialog.open(MyDialogComponent, {
          data: { ...emp, edited }
        });
        this.getAllEmployees();
      });
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || "Unable to retrieve employees");
  }
}
