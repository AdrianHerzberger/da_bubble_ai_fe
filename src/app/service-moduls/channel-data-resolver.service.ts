import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetAllChannelsRespsonse } from 'output/models/types';

@Injectable({
  providedIn: 'root'
})
export class ChannelDataResolverService {
  public dataSubjectChannel = new BehaviorSubject<GetAllChannelsRespsonse | null>(null);
  
  sendDataChannels(data: GetAllChannelsRespsonse | null) {
    this.dataSubjectChannel.next(data);
  }

  resolve(): Observable<GetAllChannelsRespsonse | null> {
    return this.dataSubjectChannel.asObservable();
  }
}
