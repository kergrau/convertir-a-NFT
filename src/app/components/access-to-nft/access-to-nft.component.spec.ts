import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessToNFTComponent } from './access-to-nft.component';

describe('AccessToNFTComponent', () => {
  let component: AccessToNFTComponent;
  let fixture: ComponentFixture<AccessToNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessToNFTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessToNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
