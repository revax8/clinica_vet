import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaServiciosComponent } from './veterinaria-servicios.component';

describe('VeterinariaServiciosComponent', () => {
  let component: VeterinariaServiciosComponent;
  let fixture: ComponentFixture<VeterinariaServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
