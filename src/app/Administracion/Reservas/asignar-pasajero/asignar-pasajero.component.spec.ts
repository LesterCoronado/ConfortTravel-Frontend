import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarPasajeroComponent } from './asignar-pasajero.component';

describe('AsignarPasajeroComponent', () => {
  let component: AsignarPasajeroComponent;
  let fixture: ComponentFixture<AsignarPasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarPasajeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarPasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
