import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleCards } from './responsible-cards';

describe('ResponsibleCards', () => {
  let component: ResponsibleCards;
  let fixture: ComponentFixture<ResponsibleCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibleCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsibleCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
