import { ISkill } from './ISkill';
import { IEmployee } from './IEmployee';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidator } from '../shared/customValidator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee
  pageTitle:string
  formErrors = {

  };

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required',
      'minlength': 'Full name must be greater than 2 characters',
      'maxlength': 'Full name must be less than 10 characters'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMisMatch': 'Email and confirm email do not match'
    },
    'phone': {
      'required': 'Phone is required.'
    },
  };
  constructor(private fb: FormBuilder, private _route: ActivatedRoute, private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [ CustomValidator.emailDomain('gmail.com')]],
        confirmEmail: [''],
      }, { validator: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data)
    })
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm)
    })

    this._route.paramMap.subscribe((params) => {
      const empId = +params.get('id')
      if (empId) {
        this.pageTitle="Edit Employee"
        this.getEmployee(empId);
      } else {
        this.pageTitle="Create Employee"
        
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        }
      }
    })
  }
  getEmployee(id: number) {
    this._employeeService.getEmployee(id).subscribe((employee: IEmployee) => {
      this.editEmployee(employee)
        this.employee = employee,
      (err => console.log(err))
    })
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    })
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills))
  }
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(
        this.fb.group({
          skillName: s.skillName,
          experienceInYears: s.experienceInYears,
          proficiency: s.proficiency
        })
      )
    })
    return formArray
  }
  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup())
  }
  removeSkillButtonClick(skillGroupIndex: number) {
    const skillsFormArray = (<FormArray>this.employeeForm.get('skills'))
    skillsFormArray.removeAt(skillGroupIndex)
    skillsFormArray.markAsDirty()
    skillsFormArray.markAsTouched()
  }
  logValidationErrors(group: FormGroup = this.employeeForm) {
    Object.keys(group.controls).forEach(key => {
      const abstractControl = group.get(key)

      this.formErrors[key] = ''
      if (abstractControl && !abstractControl.valid && abstractControl.touched || abstractControl.dirty || abstractControl.value !== '') {
        const messages = this.validationMessages[key]
        
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            console.log(key)
            this.formErrors[key] += messages[errorKey] + ' '
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl)
      }

    })
  }
  onContactPreferenceChange(selectedValue: string) { // function called when changes value of radio button of Email and Phone
    const phoneControl = this.employeeForm.get('phone')
    const emailControl = this.employeeForm.get('emailGroup').get('email')
    const confirmEmailControl = this.employeeForm.get('emailGroup').get('confirmEmail')
    
    if (selectedValue == 'phone') {
      phoneControl.setValidators(Validators.required)
    }
    else {
      phoneControl.clearValidators();
    }
    if (selectedValue == 'email') {
      emailControl.setValidators(Validators.required)
      confirmEmailControl.setValidators(Validators.required)
    }
    else {
      emailControl.clearValidators();
      confirmEmailControl.clearValidators();
    }
    phoneControl.updateValueAndValidity()
    emailControl.updateValueAndValidity()
    confirmEmailControl.updateValueAndValidity()
  }
  onLoadDataClick() {

  }
  addSkillFormGroup(): FormGroup { // add skill button
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    })
  }
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel()
    if (this.employee.id) {
      this._employeeService.updateEmployee(this.employee)
        .subscribe(() => this._router.navigate(['employees']))
    } else {
      this._employeeService.addEmployee(this.employee).subscribe(
        () => this._router.navigate(['employees']),
        (err => console.log(err))
      )
    }

  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName
    this.employee.contactPreference = this.employeeForm.value.contactPreference
    this.employee.email = this.employeeForm.value.emailGroup.email
    this.employee.phone = this.employeeForm.value.phone
    this.employee.skills = this.employeeForm.value.skills
  }
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail')
  if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null
  }
  else {
    return { 'emailMisMatch': true }
  }
}