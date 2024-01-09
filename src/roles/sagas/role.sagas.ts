import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable, delay, map } from 'rxjs';
import { StoredRoleEvent } from '../events/impl/stored-role.event';
import { UpdateRoleCommand } from '../commands/impl/update-role.command';

@Injectable()
export class RoleSagas {
  @Saga()
  storedRole = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(StoredRoleEvent),
      delay(1000),
      map((event) => {
        console.log('Inside [RoleSagas] Saga');

        return new UpdateRoleCommand(event.role._id, {
          name: event.role.name + ' updated',
        });
      }),
    );
  };
}
