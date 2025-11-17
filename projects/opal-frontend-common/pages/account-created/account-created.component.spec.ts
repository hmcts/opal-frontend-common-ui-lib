import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreated } from './account-created.component';

describe('AccountCreated', () => {
  let component: AccountCreated;
  let fixture: ComponentFixture<AccountCreated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCreated],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCreated);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
