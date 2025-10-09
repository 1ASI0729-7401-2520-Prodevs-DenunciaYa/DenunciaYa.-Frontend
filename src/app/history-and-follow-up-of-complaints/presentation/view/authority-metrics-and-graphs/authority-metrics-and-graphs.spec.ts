import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityMetricsAndGraphs } from './authority-metrics-and-graphs';

describe('AuthorityMetricsAndGraphs', () => {
  let component: AuthorityMetricsAndGraphs;
  let fixture: ComponentFixture<AuthorityMetricsAndGraphs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityMetricsAndGraphs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityMetricsAndGraphs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
