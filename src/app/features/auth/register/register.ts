import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  // If confirmPassword already has other errors (like required), don't overwrite them
  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
}

import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  readonly roles = [
    { value: 'USER', label: 'Customer' },
    { value: 'RESTAURANT_OWNER', label: 'Restaurant Partner' },
    { value: 'DELIVERY_BOY', label: 'Delivery Partner' },
  ];

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        address: [''], // Optional
        role: ['USER', [Validators.required]], // Default: USER
        agreeTerms: [false, [Validators.requiredTrue]],
      },
      {
        validators: [passwordsMatchValidator],
      }
    );

    // Revalidate confirmPassword when password changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      const confirmCtrl = this.registerForm.get('confirmPassword');
      if (confirmCtrl?.value) {
        confirmCtrl.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Exclude confirmPassword and agreeTerms from stored payload
    const { confirmPassword, agreeTerms, ...userData } = this.registerForm.value;

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.auth.register(userData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.successMessage.set('Account created successfully! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message;
        this.errorMessage.set(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Registration failed'));
      },
    });
  }
}
