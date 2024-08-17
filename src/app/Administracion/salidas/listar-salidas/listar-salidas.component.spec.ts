import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSalidasComponent } from './listar-salidas.component';

describe('ListarSalidasComponent', () => {
  let component: ListarSalidasComponent;
  let fixture: ComponentFixture<ListarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSalidasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
