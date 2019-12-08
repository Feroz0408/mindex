import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatDialogModule
} from "@angular/material";

import { MatGridListModule } from "@angular/material/grid-list";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { MatExpansionModule } from "@angular/material/expansion";

import { AppComponent } from "./app.component";
import { BackendlessMockService } from "./backendless-mock.service";
import { EmployeeComponent } from "./employee/employee.component";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeeService } from "./employee.service";
import { MyDialogComponent } from "./my-dialog/my-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmployeeListComponent,
    MyDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    HttpClientInMemoryWebApiModule.forRoot(BackendlessMockService, {
      apiBase: "api/",
      delay: 250,
      passThruUnknownUrl: true,
      post204: false,
      put204: false
    }),
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule
  ],
  entryComponents: [MyDialogComponent],
  providers: [
    EmployeeService,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
