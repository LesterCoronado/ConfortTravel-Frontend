import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPaquetesComponent } from './listar-paquetes.component';

describe('ListarPaquetesComponent', () => {
  let component: ListarPaquetesComponent;
  let fixture: ComponentFixture<ListarPaquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPaquetesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPaquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
