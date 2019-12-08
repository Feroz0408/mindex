import { BackendlessMockService } from "./backendless-mock.service";

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

describe("BackendlessMockService", () => {
  it("should create db with the employees", () => {
    let createDB = BackendlessMockService.prototype.createDb;
    expect(createDB().employees).toEqual(employees);
  });
});
