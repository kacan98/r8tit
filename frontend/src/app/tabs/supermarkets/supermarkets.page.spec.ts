import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../../shared/components/explore-container/explore-container.module';

import { SupermarketsPage } from './supermarkets.page';

describe('Tab1Page', () => {
  let component: SupermarketsPage;
  let fixture: ComponentFixture<SupermarketsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupermarketsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SupermarketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
