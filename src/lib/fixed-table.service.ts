import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class FixedColumnAndHeaderTableService {

  /**
   * 
   */
  public tableSource$: Observable<FixedColumnAndHeaderTableEvent>;

  /**
   * 
   */
  public tableSource = new Subject<FixedColumnAndHeaderTableEvent>();
 
  /**
   * 
   */
  constructor() {
    this.tableSource$ = this.tableSource.asObservable();
  }

  /**
   * 
   * @param event 
   */
  tableCreated(event: FixedColumnAndHeaderTableEvent) {
    this.tableSource.next(event);
  }
}

/**
 * 
 */
export class FixedColumnAndHeaderTableEvent {
  public event: Event;
  public top: number;
  public left: number;
}
