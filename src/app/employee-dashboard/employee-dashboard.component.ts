import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.modal';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  showAdd !: boolean;
  showUpdate !: boolean;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employees : EmployeeModel[] = [];
  constructor(private formbuilder: FormBuilder,private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        mobile: [''],
        salary: ['']
    });
    this.getEmployeeDetails();
  }

  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEmployeeDetails() {
    this.employeeModelObj.id = this.formValue.value.id;
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.api.postEmployee(this.employeeModelObj).subscribe((res) => {
        alert("Employee Added Successfully");
        this.formValue.reset();
        let ref = document.getElementById('cancel');
        ref?.click();
        this.getEmployeeDetails();
    },
    (err) => {
        alert("Something went wrong");
    })
  }

  getEmployeeDetails() {
    this.api.getEmployee().subscribe((res) => {
      this.employees = res;
    })
  }

  deleteEmployee(id: number) {
    this.api.deleteEmployee(id).subscribe((res) => {
      alert("Employee Deleted");
      this.getEmployeeDetails();
    })
  }

  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);
  }

  updateEmployeeDetails() {
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.api.updateEmployee(this.employeeModelObj.id, this.employeeModelObj).subscribe(() => {
      alert("Employee Updated");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.getEmployeeDetails();
    });
  }
}
