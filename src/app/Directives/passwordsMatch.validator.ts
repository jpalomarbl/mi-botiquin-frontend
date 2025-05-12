import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordsMatch(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordsMatch: true });
      return { passwordsMatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  };
}
