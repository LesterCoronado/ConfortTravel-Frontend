import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCotizacionesComponent } from './editar-cotizaciones.component';

describe('EditarCotizacionesComponent', () => {
  let component: EditarCotizacionesComponent;
  let fixture: ComponentFixture<EditarCotizacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCotizacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
