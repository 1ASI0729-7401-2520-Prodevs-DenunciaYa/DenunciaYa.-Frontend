import { Injectable, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { User } from '../domain/model/user.entity';
import { UserApi } from '../infrastructure/user-api';

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

  /**
   * Carga todos los usuarios según rol
   */
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

  /**
   * Login genérico según rol
   */
  login(role: 'citizen' | 'authority' | 'responsibles', email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.userApi.login(role, email, password).pipe(retry(2)).subscribe({
      next: user => {
        if (user) {
          this.currentUserSignal.set(user);
          localStorage.setItem('currentUser', JSON.stringify(user)); // 💾 persistencia opcional
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
