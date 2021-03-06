import { ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordMissmatchValidator(pass1, pass2): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const passwordMissmatch = (pass1 ===  pass2);
    console.log('Validator executed. Response: ', passwordMissmatch);
    return passwordMissmatch ? null : { passwordMissmatch: true};
  };
}
