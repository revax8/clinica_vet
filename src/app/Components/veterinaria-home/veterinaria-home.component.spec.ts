import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaHomeComponent } from './veterinaria-home.component';

describe('VeterinariaHomeComponent', () => {
  let component: VeterinariaHomeComponent;
  let fixture: ComponentFixture<VeterinariaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
