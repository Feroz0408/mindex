import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Employee } from "../employee";
import { MyDialogComponent } from "../my-dialog/my-dialog.component";
import { EmployeeListComponent } from "../employee-list/employee-list.component";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"]
})
export class EmployeeComponent implements OnInit {
  allReports: object[] = [];
  @Input() employee: any;
  @Output() updateEmployeeCompensation = new EventEmitter<number>();
  @Output() deleteEmployee = new EventEmitter<{
    employee: object;
    reporter: object;
  }>();
  employees: Employee[] = [];

  constructor(
    private dialog: MatDialog,
    private employeeList: EmployeeListComponent
  ) {}

  ngOnInit(): void {
    this.employees = this.employeeList.employees;
    this.getAllReports(this.employees);
  }

  // function to get the direct and indirect reports for all employees on component initialization
  getAllReports(employees) {
    employees.forEach((employee: Employee) => {
      if (!!employee.directReports) {
        employee.directReports.forEach((elem: any) => {
          this.allReports.push(
            ...employees.filter((e: { id: any }) => e.id === elem)
          );
        });
        this.getReports(employee, employees);
        employee.reports = Array.from(new Set(this.allReports));
        this.allReports = [];
      }
    });
  }

  // function to recursively check for direct reports of direct and indirect employees
  getReports(emp: Employee, allEmployees: Employee[]) {
    if (emp.directReports.length === 0) {
      return;
    }
    if (!!emp) {
      emp.directReports.forEach((report: number) => {
        const employ = allEmployees.filter(e => e.id === report);
        this.allReports.push(...employ);
        this.getReports(employ[0], allEmployees);
      });
    }
  }

  // function to initiate the delete report and emit to employee list for service call
  deleteDirectReport(employee: Employee, reporter: Employee) {
    if (employee.directReports.includes(reporter.id)) {
      const ind = employee.directReports.indexOf(reporter.id);
      employee.directReports.splice(ind, 1);
      this.deleteEmployee.emit({ employee, reporter });
    } else {
      this.deleteIndirectReport(reporter);
    }
  }

  // function to initiate the delete the indirect report and emit to EmployeeList for service call
  deleteIndirectReport(reporter: { id: number }) {
    this.employees.forEach(employee => {
      if (employee.directReports.includes(reporter.id)) {
        const indirectIndex = employee.directReports.indexOf(reporter.id);
        employee.directReports.splice(indirectIndex, 1);
        this.deleteEmployee.emit({ employee, reporter });
      }
    });
  }

  // function to open the popup on edit or delete icon click and emit the updated compensation value to EmployeeList for service call
  openDialog(employee: any, reporter: any, editDelete: string): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      data: { ...employee, popUpCheck: editDelete }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDeleted === "deleted") {
        delete result.popUpCheck;
        delete result.isDeleted;
        this.deleteDirectReport(employee, reporter);
        // timer to close all dialogs on succesful service call
        setTimeout(() => this.dialog.closeAll(), 2000);
      } else if (result.isEdited === "edited") {
        delete result.popUpCheck;
        delete result.isEdited;
        this.updateEmployeeCompensation.emit(result);
        // timer to close all dialogs on succesful service call
        setTimeout(() => this.dialog.closeAll(), 2000);
      }
    });
  }
}
