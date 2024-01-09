import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StoredRoleEvent } from '../impl/stored-role.event';

@EventsHandler(StoredRoleEvent)
export class StoredRoleHandler implements IEventHandler<StoredRoleEvent> {
  handle(event: StoredRoleEvent) {
    console.log('Stored role:', event);
  }
}
