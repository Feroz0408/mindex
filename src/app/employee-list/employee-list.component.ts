import { Component, OnInit } from "@angular/core";
import { catchError, map, reduce } from "rxjs/operators";

import { Employee } from "../employee";
import { EmployeeService } from "../employee.service";
import { MatDialog } from "@angular/material/dialog";
import { MyDialogComponent } from "../employee/my-dialog/my-dialog.component";

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
    this.getDirectIndirectReports();
  }

  getDirectIndirectReports() {
    this.employeeService
      .getAll()
      .pipe(
        reduce((emps, e: Employee) => {
          return emps.concat(e);
        }, []),
        map(emps => (this.employees = emps)),
        catchError(this.handleError.bind(this))
      )
      .subscribe(() => {
        this.employees.forEach(emp => {
          // tslint:disable-next-line: no-unused-expression
          emp.directReports &&
            emp.directReports.forEach(report => {
              this.employeeService.get(report).subscribe(directReport => {
                directReport !== null && emp.reports
                  ? emp.reports.push(directReport)
                  : (emp.reports = [directReport]);
                directReport.directReports && // checks if there are any direct reports
                  directReport.directReports.forEach(rep => {
                    // tslint:disable-next-line: no-unused-expression
                    !emp.directReports.includes(rep) && // checks if there are any indirect reports
                      this.employeeService
                        .get(rep)
                        .subscribe(indirectReport => {
                          indirectReport !== null && emp.reports
                            ? emp.reports.push(indirectReport)
                            : (emp.reports = [indirectReport]);
                        }, catchError(this.handleError.bind(this)));
                  });
              }, catchError(this.handleError.bind(this)));
            });
        });
      });
  }

  editDeleteServiceHandler(emp) {
    if (emp.isDeleted === "deleted") {
      this.employeeService.remove(emp).subscribe();
      const deleted = true;
      this.dialog.open(MyDialogComponent, {
        data: { ...emp, deleted }
      });
      delete emp.isDeleted;
      this.getDirectIndirectReports();
    } else if (emp.isEdited === "edited") {
      this.employeeService.save(emp).subscribe();
      const edited = true;
      this.dialog.open(MyDialogComponent, {
        data: { ...emp, edited }
      });
      delete emp.isEdited;
      this.getDirectIndirectReports();
    }
  }

  private handleError(e: Error | any): string {
    console.error(e);
    return (this.errorMessage = e.message || "Unable to retrieve employees");
  }
}
