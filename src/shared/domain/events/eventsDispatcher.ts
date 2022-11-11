import { UniqueEntityID } from "../UniqueEntityID";
import { DomainEvents } from "./DomainEvents";

export function dispatchEvents(uniqueId: string | number): void {
  const aggregateId = new UniqueEntityID(uniqueId);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
}
