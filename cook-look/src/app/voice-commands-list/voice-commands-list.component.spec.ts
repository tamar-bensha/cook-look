import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceCommandsListComponent } from './voice-commands-list.component';

describe('VoiceCommandsListComponent', () => {
  let component: VoiceCommandsListComponent;
  let fixture: ComponentFixture<VoiceCommandsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoiceCommandsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceCommandsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
