import { Observable } from "rxjs";
import { IIntent } from "src/app/intent/models/intent.model";
import { IIdentifiable } from "../../models/base";

export interface IIntentService<TEntity extends IIdentifiable> {

  getIntents(entity: TEntity): Observable<IIntent[]>;

  addIntent(entity: TEntity, intent: IIntent): Observable<IIntent>;

  modifyIntent(intent: IIntent): Observable<IIntent>;

  deleteIntent(intent: IIntent): Observable<IIntent>;
}
