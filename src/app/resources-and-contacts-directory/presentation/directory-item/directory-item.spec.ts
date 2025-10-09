import { ComponentFixture, TestBed } from '@angular/core/testing';

// ANTES: import { DirectoryItemComponent } from './directory-item.component';
import { DirectoryItemComponent } from './directory-item'; // <-- RUTA CORREGIDA

describe('DirectoryItemComponent', () => {
  let component: DirectoryItemComponent;
  let fixture: ComponentFixture<DirectoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DirectoryItemComponent);
    component = fixture.componentInstance;
    // Simular el @Input para que la prueba no falle
    component.entity = {
      id: '1', name: 'Test', type: 'Test', district: 'Test', category: 'Test',
      address: 'Test', attentionHours: 'Test', services: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
