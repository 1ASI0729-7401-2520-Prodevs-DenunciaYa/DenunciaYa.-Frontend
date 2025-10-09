import { Injectable, Signal, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { UserApi } from '../infrastructure/user-api';

/**
 * UserStore manages application state related to users,
 * including login, registration, and password recovery.
 */
@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private readonly usersSignal = signal<User[]>([]);
  readonly users = this.usersSignal.asReadonly();

  private readonly currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly userCount = computed(() => this.users().length);

  constructor(private userApi: UserApi) {
    this.loadAllUsers();
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }

  /**
   * Loads all users from the API and updates the store.
   */
  private loadAllUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.getAll().pipe(takeUntilDestroyed()).subscribe({
      next: users => {
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load users'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Attempts to log in with email and password.
   * On success, sets the current user.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.login(email, password).pipe(retry(2)).subscribe({
      next: user => {
        if (user) {
          this.currentUserSignal.set(user);
        } else {
          this.errorSignal.set('Invalid credentials');
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to login'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Registers a new user and adds them to the store.
   * @param user - The User entity to register.
   */
  register(user: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.register(user).pipe(retry(2)).subscribe({
      next: createdUser => {
        this.usersSignal.update(users => [...users, createdUser]);
        this.currentUserSignal.set(createdUser);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to register user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates a user's password for recovery process.
   * Simulates "reset password" with new password confirmation.
   * @param userId - ID of the user whose password will be updated.
   * @param newPassword - The new password.
   * @param confirmPassword - The confirmation of the new password.
   */
  recoverPassword(userId: number, newPassword: string, confirmPassword: string): void {
    if (newPassword !== confirmPassword) {
      this.errorSignal.set('Passwords do not match');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const user = this.usersSignal().find(u => u.id === userId);
    if (!user) {
      this.errorSignal.set('User not found');
      this.loadingSignal.set(false);
      return;
    }

    const updatedUser: User = { ...user, password: newPassword };

    this.userApi.updatePassword(userId, updatedUser).pipe(retry(2)).subscribe({
      next: () => {
        this.usersSignal.update(users =>
          users.map(u => (u.id === userId ? updatedUser : u))
        );
        if (this.currentUserSignal()?.id === userId) {
          this.currentUserSignal.set(updatedUser);
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update password'));
        this.loadingSignal.set(false);
      }
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
