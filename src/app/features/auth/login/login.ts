import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private router: Router, private auth: AuthService) {}
  hidePassword = signal(true);
  hidePartnerPassword = signal(true);
  otpSent = signal(false);
  userEmail = signal('');
  userPassword=signal('')
  partnerEmail = signal('')
  partnerPassword=signal('')
  
  formSubmit() {
    this.auth.login(this.userEmail(), this.userPassword()).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) =>
        alert(err.error?.message?.toString() ?? 'Invalid email or password'),
    });
  }

  sendOtp() {
    this.otpSent.set(true);
  }

  changePhone() {
    this.otpSent.set(false);
  }
}
