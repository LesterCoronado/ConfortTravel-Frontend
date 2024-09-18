import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPlanillaComponent } from './agregar-planilla.component';

describe('AgregarPlanillaComponent', () => {
  let component: AgregarPlanillaComponent;
  let fixture: ComponentFixture<AgregarPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarPlanillaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
