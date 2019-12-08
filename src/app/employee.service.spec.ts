import { TestBed, inject, fakeAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BackendlessMockService } from "./backendless-mock.service";
import { EmployeeService } from "./employee.service";
import { Employee } from "./employee";

const employees: Employee[] = [
  {
    id: 1,
    firstName: "Brian",
    lastName: "McGee",
    position: "CEO",
    directReports: [2, 3],
    compensation: 100
  },
  {
    id: 2,
    firstName: "Homer",
    lastName: "Thompson",
    position: "Dev Manager",
    directReports: [4],
    compensation: 100
  },
  {
    id: 3,
    firstName: "Rock",
    lastName: "Strongo",
    position: "Lead Tester",
    directReports: [],
    compensation: 100
  },
  {
    id: 4,
    firstName: "Max",
    lastName: "Power",
    position: "Junior Software Engineer",
    directReports: [],
    compensation: 100
  }
];

describe("EmployeeService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService, BackendlessMockService]
    });
  });

  it("Employee Service should be created", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      expect(service).toBeTruthy();
    })
  ));

  it("should return all the employees", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      service.getAll().subscribe(data => {
        expect(data).toBe(employees[0], "No Employees retrieved");
      });
    })
  ));

  it("should retrieve employee using employee ID", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      service.get(employees[2].id).subscribe(value => {
        expect(value).toEqual(employees[2]);
      });
    })
  ));

  it("should update the employee compensation", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      const updatedEmployeeCompensation = {
        id: 4,
        firstName: "Max",
        lastName: "Power",
        position: "Junior Software Engineer",
        directReports: [],
        compensation: 1000
      };
      service.save(updatedEmployeeCompensation).subscribe(value => {
        expect(value.compensation).toEqual(1000);
      });
    })
  ));

  it("should delete the employee using employee object", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      const deletedEmployee = {
        id: 3,
        firstName: "Rock",
        lastName: "Strongo",
        position: "Lead Tester",
        directReports: [],
        compensation: 100
      };
      service.remove(deletedEmployee).subscribe(value => {
        expect(value).toBe(null);
      });
    })
  ));

  it("should invoke post function if the employee id is not found", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      const newEmployee = {
        id: null,
        firstName: "Feroz",
        lastName: "Shaik",
        position: "Web Developer",
        directReports: [],
        compensation: 1200
      };
      service.save(newEmployee).subscribe(value => {
        expect(value).toEqual(newEmployee);
      });
    })
  ));

  it("should invoke put method", fakeAsync(
    inject([EmployeeService], (service: EmployeeService) => {
      const newEmployee = {
        id: null,
        firstName: "Feroz",
        lastName: "Shaik",
        position: "Web Developer",
        directReports: [],
        compensation: 1200
      };
      service.save(newEmployee).subscribe(value => {
        expect(value).toEqual(newEmployee);
      });
    })
  ));
});
