import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationView } from './configuration-view';

describe('ConfigurationView', () => {
  let component: ConfigurationView;
  let fixture: ComponentFixture<ConfigurationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
