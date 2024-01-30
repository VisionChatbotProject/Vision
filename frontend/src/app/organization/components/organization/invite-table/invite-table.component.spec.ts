import { ComponentFixture, TestBed } from '@angular/core/testing';
import { dummyInvites } from 'src/testutils/object-mocks';
import { getHTMLElement } from 'src/testutils/utils';

import { InviteTableComponent } from './invite-table.component';

describe('InviteTableComponent', () => {
  let component: InviteTableComponent;
  let fixture: ComponentFixture<InviteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteTableComponent ]
    })
    .compileComponents();
  });

  describe('w/o invites', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(InviteTableComponent);
      component = fixture.componentInstance;
      component.invites = [];
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show the "no invites" text', () => {
      expect(getHTMLElement(fixture, '#noOpenInvitesDescription')).toBeTruthy();
    })
  });

  describe('w/ invites', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(InviteTableComponent);
      component = fixture.componentInstance;
      component.invites = dummyInvites;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show the "no invites" text', () => {
      expect(getHTMLElement(fixture, '#noOpenInvitesDescription')).toBeFalsy();
    })

    it('should only contain the two unused invites', () => {
      expect(component.tableData.length).toBe(2);
    });
  });
});
