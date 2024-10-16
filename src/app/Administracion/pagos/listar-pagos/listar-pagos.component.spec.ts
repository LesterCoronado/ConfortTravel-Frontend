import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPagosComponent } from './listar-pagos.component';

describe('ListarPagosComponent', () => {
  let component: ListarPagosComponent;
  let fixture: ComponentFixture<ListarPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
