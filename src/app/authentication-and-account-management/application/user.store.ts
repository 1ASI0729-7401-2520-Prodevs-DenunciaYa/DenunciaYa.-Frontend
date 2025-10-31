import { Injectable, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { UserApi } from '../infrastructure/user-api';

/**
 * @class UserStore
 * @summary Manages user authentication and account state.
 * @method loadAllUsers - Loads all users of a specific role.
 * @method login - Authenticates a user with email and password.
 * @method register - Registers a new user.
 * @method logout - Logs out the current user.
 * @property users - Readonly signal of all users.
 * @property currentUser - Readonly signal of the currently logged-in user.
 * @property loading - Readonly signal indicating loading state.
 * @property error - Readonly signal for error messages.
 * @property userCount - Computed property for the number of users.
 */
@Injectable({ providedIn: 'root' })
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

  constructor(private userApi: UserApi) {}

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) return error.message || fallback;
    return fallback;
  }

  loadAllUsers(role: 'citizen' | 'authority' | 'responsibles'): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.getAll(role).pipe(takeUntilDestroyed()).subscribe({
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


  login(role: 'citizen' | 'authority' | 'responsibles', email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.login(role, email, password).pipe(retry(2)).subscribe({
      next: user => {
        if (user) {
          this.currentUserSignal.set(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
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

  register(role: 'citizen' | 'authority' | 'responsibles', user: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.register(role, user).pipe(retry(2)).subscribe({
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

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }
}
