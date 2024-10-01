import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetAllUsersResponse } from 'output/models/types';

@Injectable({
  providedIn: 'root'
})
export class UserDataResolveService {
  public dataSubjectUsers = new BehaviorSubject<GetAllUsersResponse | null >(null);

  sendDataUsers(data: GetAllUsersResponse | null) {
    this.dataSubjectUsers.next(data);
  }

  resolve(): Observable<GetAllUsersResponse | null> {
    return this.dataSubjectUsers.asObservable();
  }
}
