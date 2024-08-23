import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarNoIncluyeComponent } from './listar-no-incluye.component';

describe('ListarNoIncluyeComponent', () => {
  let component: ListarNoIncluyeComponent;
  let fixture: ComponentFixture<ListarNoIncluyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarNoIncluyeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarNoIncluyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
