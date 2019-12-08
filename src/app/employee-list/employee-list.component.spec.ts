import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { Component, Input } from "@angular/core";
import { EmployeeListComponent } from "./employee-list.component";
import { EmployeeService } from "../employee.service";
import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Employee } from "../employee";
import { By } from "@angular/platform-browser";

@Component({ selector: "app-employee", template: "" })
class EmployeeComponent {
  @Input("employee") employee: any;
}

@Component({ selector: "mat-grid-list", template: "" })
class GridListComponent {}

@Component({ selector: "mat-grid-tile", template: "" })
class GridTileComponent {}

@Component({ selector: "app-my-dialog", template: "" })
class MyDialogComponent {}

const matDialogSpy = jasmine.createSpyObj("MatDialog", [
  "open",
  "close",
  "afterClosed"
]);
const employeeServiceSpy = jasmine.createSpyObj("EmployeeService", [
  "getAll",
  "get",
  "save",
  "remove"
]);

const employees = [
  {
    id: 1,
    firstName: "Brian",
    lastName: "McGee",
    position: "CEO",
    directReports: [2, 3]
  },
  {
    id: 2,
    firstName: "Homer",
    lastName: "Thompson",
    position: "Dev Manager",
    directReports: [4]
  },
  {
    id: 3,
    firstName: "Rock",
    lastName: "Strongo",
    position: "Lead Tester",
    directReports: []
  },
  {
    id: 4,
    firstName: "Max",
    lastName: "Power",
    position: "Junior Software Engineer",
    directReports: []
  }
];

describe("EmployeeListComponent", () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeListComponent,
        EmployeeComponent,
        GridListComponent,
        GridTileComponent
      ],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  }));

  it("should create the component", async(() => {
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  it("should call ngOnInit on initialization", async(() => {
    spyOn(component, "ngOnInit");
    fixture.detectChanges();
    expect(component.ngOnInit).toHaveBeenCalled();
  }));

  it("should get All employees and call getAll service on init", async(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    const getAllSpy = employeeServiceSpy.getAll.and.returnValue(of(employees));
    fixture.detectChanges();
    expect(getAllSpy.calls.any()).toBe(
      true,
      "function getAll Employees did not get called"
    );
  }));

  it("updatedEmployeeCompensation should update Employee Compensation", async(() => {
    const updatedEmployeeCompensation: Employee = {
      id: 1,
      firstName: "Brian",
      lastName: "McGee",
      position: "CEO",
      directReports: [2, 3],
      compensation: 100
    };
    component = fixture.componentInstance;
    const updatedEmployeeCompensationSpy = employeeServiceSpy.save.and.returnValue(
      of(updatedEmployeeCompensation)
    );
    component.updateEmployeeCompensation(updatedEmployeeCompensation);
    fixture.detectChanges();

    expect(updatedEmployeeCompensationSpy.calls.any()).toBe(
      true,
      "updatedEmployeeCompensation function did not get called"
    );
  }));

  it("should call deleteEmployee on delete", async(() => {
    const deleteEmployee: any = {
      employee: {
        id: 1,
        firstName: "Brian",
        lastName: "McGee",
        position: "CEO",
        directReports: [2, 3],
        compensation: 4000
      },
      reporter: {
        id: 2,
        firstName: "Homer",
        lastName: "Thompson",
        position: "Dev Manager",
        directReports: [4],
        compensation: 4000
      }
    };
    component = fixture.componentInstance;
    const deleteEmployeeSpy = employeeServiceSpy.save.and.returnValue(
      of(deleteEmployee.reporter)
    );
    component.deleteEmployee(deleteEmployee);
    fixture.detectChanges();

    expect(deleteEmployeeSpy.calls.any()).toBe(
      true,
      "delete employee function did not get called"
    );
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  }));

  it("should call getAllEmployees on initialization", () => {
    spyOn(component, "getAllEmployees");
    fixture.detectChanges();
    expect(component.getAllEmployees).toHaveBeenCalled();
  });

  it("should display mat grid list", () => {
    const elem = fixture.debugElement.queryAll(By.css(".employee-list"));
    expect(elem).toBeDefined();
  });
});
