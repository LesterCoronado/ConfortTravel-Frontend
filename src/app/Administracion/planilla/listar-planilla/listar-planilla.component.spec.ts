import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanillaComponent } from './listar-planilla.component';

describe('ListarPlanillaComponent', () => {
  let component: ListarPlanillaComponent;
  let fixture: ComponentFixture<ListarPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPlanillaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
