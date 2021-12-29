/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UiStateControllerService } from './ui-state-controller.service';

describe('Service: UiStateController', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiStateControllerService]
    });
  });

  it('should ...', inject([UiStateControllerService], (service: UiStateControllerService) => {
    expect(service).toBeTruthy();
  }));
});
