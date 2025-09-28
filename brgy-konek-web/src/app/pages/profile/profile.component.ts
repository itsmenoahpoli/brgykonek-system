import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardLayoutComponent } from '../../components/shared/dashboard-layout/dashboard-layout.component';
import { AuthService, User } from '../../services/auth.service';
import { StatusModalComponent } from '../../components/shared/status-modal/status-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DashboardLayoutComponent, StatusModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isSavingProfile = false;
  isChangingPassword = false;
  profileSuccess = false;
  profileError = '';
  passwordError = '';
  passwordSuccess = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName || '', [Validators.required, Validators.minLength(2)]],
      middleName: [this.user?.middleName || ''],
      lastName: [this.user?.lastName || '', [Validators.required, Validators.minLength(2)]],
      email: [this.user?.email || ''],
      phone: [this.user?.phone || '', [Validators.required]],
      sitio: [this.user?.sitio || '', [Validators.required]],
      municipality: ['Bongabong'],
      province: ['Oriental Mindoro'],
    });
    this.passwordForm = this.fb.group({
      current_password: ['', [Validators.required, Validators.minLength(6)]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_new_password: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: FormGroup) {
    const np = group.get('new_password')?.value;
    const cp = group.get('confirm_new_password')?.value;
    if (np && cp && np !== cp) {
      group.get('confirm_new_password')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  async saveProfile() {
    if (!this.profileForm.valid) return;
    this.isSavingProfile = true;
    this.profileError = '';
    const payload: Partial<User> = this.profileForm.value;
    this.authService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        if (res.success) {
          this.user = res.user || null;
          this.profileSuccess = true;
        } else {
          this.profileError = res.message || 'Failed to update profile';
        }
      },
      error: () => {
        this.isSavingProfile = false;
        this.profileError = 'Failed to update profile';
      }
    });
  }

  changePassword() {
    if (!this.passwordForm.valid) return;
    this.isChangingPassword = true;
    this.passwordError = '';
    const email = this.user?.email || '';
    const current = this.passwordForm.get('current_password')?.value;
    const next = this.passwordForm.get('new_password')?.value;
    this.authService.resetPassword(email, current, next).subscribe({
      next: (res) => {
        this.isChangingPassword = false;
        if (res.success) {
          this.passwordSuccess = true;
          this.passwordForm.reset();
        } else {
          this.passwordError = res.message || 'Failed to change password';
        }
      },
      error: () => {
        this.isChangingPassword = false;
        this.passwordError = 'Failed to change password';
      }
    });
  }

  onProfileSuccessClosed() {
    this.profileSuccess = false;
  }

  onPasswordSuccessClosed() {
    this.passwordSuccess = false;
  }
}
