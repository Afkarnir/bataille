import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { ErrorState } from './error.state';
import { SetError } from './error.actions';

describe('Error state', () => {
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
       providers: [provideStore([ErrorState])]
      
      });

      store = TestBed.inject(Store);
    });

    it('should create an empty state', () => {
        const error = store.selectSnapshot(ErrorState.getError);
        const isError = store.selectSnapshot(ErrorState.isError);

        expect(error).toEqual(null);
        expect(isError).toEqual(false);
    });

    it('should set error', () => {
        store.dispatch(new SetError({message: 'test'}));

        const error = store.selectSnapshot(ErrorState.getError);
        const isError = store.selectSnapshot(ErrorState.isError);

        expect(error).toEqual({message: 'test'});
        expect(isError).toEqual(true);
    })
});
