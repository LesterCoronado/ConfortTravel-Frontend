import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCotizacionesComponent } from './agregar-cotizaciones.component';

describe('AgregarCotizacionesComponent', () => {
  let component: AgregarCotizacionesComponent;
  let fixture: ComponentFixture<AgregarCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCotizacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
