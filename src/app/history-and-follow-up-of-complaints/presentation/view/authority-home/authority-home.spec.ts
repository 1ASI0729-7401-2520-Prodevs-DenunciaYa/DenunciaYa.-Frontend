import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityHome } from './authority-home';

describe('AuthorityHome', () => {
  let component: AuthorityHome;
  let fixture: ComponentFixture<AuthorityHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
