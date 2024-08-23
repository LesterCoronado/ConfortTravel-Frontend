import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarIncluyeComponent } from './listar-incluye.component';

describe('ListarIncluyeComponent', () => {
  let component: ListarIncluyeComponent;
  let fixture: ComponentFixture<ListarIncluyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarIncluyeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarIncluyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
