import { async, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { AppComponent } from "./app.component";

@Component({ selector: "app-employee-list", template: "" })
class EmployeeListComponent {}

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, EmployeeListComponent]
    }).compileComponents();
  }));

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  it("should display header text", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("h1").textContent).toContain(
      "Mindex Coding Challenge"
    );
  }));

  it("should display view hierarchy button", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector("a").textContent).toContain(
      "View Employee Hierarchy"
    );
  }));
});
