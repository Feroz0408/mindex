import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { MyDialogComponent } from "./my-dialog.component";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { Employee } from "../employee";
import { of } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({ selector: "mat-icon", template: "" })
class IconComponent {}

@Component({ selector: "mat-dialog-content", template: "" })
class DialogContent {}

@Component({ selector: "mat-dialog-actions", template: "" })
class DialogActions {}

@Component({ selector: "mat-form-field", template: "" })
class FormField {}

const employee = {
  id: 1,
  firstName: "Brian",
  lastName: "McGee",
  position: "CEO",
  directReports: [2, 3],
  compensation: 1000
};

describe("MyDialogComponent", () => {
  let component: MyDialogComponent;
  let fixture: ComponentFixture<MyDialogComponent>;
  let dialogRefSpyObj = {
    close: () => {}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyDialogComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpyObj }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MyDialogComponent]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(MyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create my dialog component", () => {
    expect(component).toBeTruthy();
  });

  it("should call delete method on clicking delete icon", async(() => {
    spyOn(component, "deleteEmployee");
    component.deleteEmployee(employee, "deleted");
    expect(component.deleteEmployee).toHaveBeenCalled();
  }));

  it("should close dialog on save", () => {
    const obj = {
      id: 1,
      firstName: "Brian",
      lastName: "McGee",
      position: "CEO",
      directReports: [2, 3],
      compensation: 1000,
      isEdited: "edited"
    };
    const spy = spyOn(component.dialogRef, "close").and.callThrough();
    component.updateEmployeeCompensation(employee, 1000, "edited");
    expect(spy).toHaveBeenCalledWith(obj);
  });

  it("should call updateEmployeeCompensation method on clicking edit icon", async(() => {
    spyOn(component, "updateEmployeeCompensation");
    const employee = {
      id: 1,
      firstName: "Brian",
      lastName: "McGee",
      position: "CEO",
      directReports: [2, 3],
      compensation: 1000
    };
    component.updateEmployeeCompensation(employee, 2000, "edited");
    fixture.detectChanges();
    expect(component.updateEmployeeCompensation).toHaveBeenCalled();
  }));

  it("should close dialog on update", () => {
    const obj = {
      id: 1,
      firstName: "Brian",
      lastName: "McGee",
      position: "CEO",
      directReports: [2, 3],
      compensation: 1000,
      isDeleted: "deleted"
    };
    const spy = spyOn(component.dialogRef, "close").and.callThrough();
    component.deleteEmployee(employee, "deleted");
    expect(spy).toHaveBeenCalledWith(obj);
  });
});
