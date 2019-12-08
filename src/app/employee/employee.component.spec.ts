import {
  async,
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync
} from "@angular/core/testing";
import { Component } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule
} from "@angular/material/dialog";
import { EmployeeListComponent } from "../employee-list/employee-list.component";
import { EmployeeComponent } from "./employee.component";
import { of } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Employee } from "../employee";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({ selector: "mat-card", template: "" })
class CardComponent {}

@Component({ selector: "mat-card-header", template: "" })
class CardHeaderComponent {}

@Component({ selector: "mat-card-title", template: "" })
class CardTitleComponent {}

@Component({ selector: "mat-card-subtitle", template: "" })
class CardSubtitleComponent {}

@Component({ selector: "mat-card-content", template: "" })
class CardContentComponent {}

const employeeListSpy = jasmine.createSpyObj("EmployeeListComponent", [
  "employees",
  "getAllEmployees",
  "deleteEmployee",
  "updateEmployeeCompensation"
]);

const employees: Employee[] = [
  {
    id: 1,
    firstName: "Brian",
    lastName: "McGee",
    position: "CEO",
    directReports: [2, 3],
    compensation: 0
  },
  {
    id: 2,
    firstName: "Homer",
    lastName: "Thompson",
    position: "Dev Manager",
    directReports: [4],
    compensation: 0
  },
  {
    id: 3,
    firstName: "Rock",
    lastName: "Strongo",
    position: "Lead Tester",
    directReports: [],
    compensation: 0
  },
  {
    id: 4,
    firstName: "Max",
    lastName: "Power",
    position: "Junior Software Engineer",
    directReports: [],
    compensation: 0
  }
];

describe("EmployeeComponent", () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let matDialogSpy: jasmine.Spy;
  let matDialogCloseAllSpy: jasmine.Spy;
  let matDialogRefSpy: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EmployeeComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleComponent,
        CardSubtitleComponent,
        CardContentComponent
      ],
      imports: [
        MatIconModule,
        MatDialogModule,
        MatListModule,
        MatExpansionModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: EmployeeListComponent, useValue: employeeListSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    component.employee = employees[0];
  }));

  it("should create the component", async(() => {
    expect(component).toBeTruthy();
  }));

  it("should invoke getAllReports function on initialization", async(() => {
    spyOn(component, "getAllReports");
    fixture.detectChanges();
    expect(component.getAllReports).toHaveBeenCalled();
  }));

  it("should invoke getReports function", () => {
    const emp = [
      {
        id: 1,
        firstName: "Brian",
        lastName: "McGee",
        position: "CEO",
        directReports: [2, 3],
        compensation: 0,
        reports: [
          {
            id: 1,
            firstName: "Brian",
            lastName: "McGee",
            position: "CEO",
            directReports: [2, 3],
            compensation: 0
          }
        ]
      }
    ];
    spyOn(component, "getReports");
    component.getAllReports(emp);
    expect(component.getReports).toHaveBeenCalled();
  });

  it("should check whether allReports is emptied after getAllReports", () => {
    component.getAllReports(employees);
    expect(component.allReports.length).toEqual(0);
  });

  it("should check whether allReports is emptied after getReports", () => {
    component.getReports(employees[3], employees);
    expect(component.allReports.length).toEqual(0);
  });

  it("should check the length of direct reports after report delete", () => {
    component.deleteDirectReport(employees[0], employees[2]);
    expect(employees[0].directReports.length).toEqual(1);
  });

  it("should check the length of direct reports after indirect report delete", () => {
    component.employees = employees;
    component.deleteDirectReport(employees[0], employees[3]);
    expect(employees[1].directReports.length).toEqual(0);
  });

  it("should open edit employee compensation popUp Model", fakeAsync(() => {
    matDialogRefSpy = jasmine.createSpyObj({
      afterClosed: of({ ...employees[0], isDeleted: "deleted" }),
      close: null
    });
    matDialogRefSpy.componentInstance = { body: "" };
    matDialogSpy = spyOn(TestBed.get(MatDialog), "open").and.returnValue(
      matDialogRefSpy
    );
    component.openDialog(employees[0], employees[0], "edited");
    expect(matDialogSpy).toHaveBeenCalled();
    expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
    matDialogCloseAllSpy = spyOn(TestBed.get(MatDialog), "closeAll");
    tick(2000);
    expect(matDialogCloseAllSpy).toHaveBeenCalled();
  }));

  it("should open delete employee popUp Model", fakeAsync(() => {
    matDialogRefSpy = jasmine.createSpyObj({
      afterClosed: of({
        ...employees[0],
        compensation: 100,
        isEdited: "edited"
      }),
      close: null,
      closeAll: null
    });
    matDialogRefSpy.componentInstance = { body: "" };
    matDialogSpy = spyOn(TestBed.get(MatDialog), "open").and.returnValue(
      matDialogRefSpy
    );
    spyOn(component, "deleteDirectReport");
    component.openDialog(employees[0], employees[2], "deleted");
    expect(matDialogSpy).toHaveBeenCalled();
    expect(matDialogRefSpy.afterClosed).toHaveBeenCalled();
    matDialogCloseAllSpy = spyOn(TestBed.get(MatDialog), "closeAll");
    tick(2000);
    expect(matDialogCloseAllSpy).toHaveBeenCalled();
  }));
});
