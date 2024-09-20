import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { APIClient } from 'output';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { UserDataService } from './user.service';
import { HttpHeaders } from '@angular/common/http';

export interface ChannelDataInterface {
  id?: any;
  channelName: string;
  channelDescription: string;
  createdByUser?: string;
  color?: any;
  users?: any;
}

export interface ChannelDataTypes {
  userId: number | null;
  channelName: string;
  channelDescription: string;
  color?: any;
}

@Injectable({
  providedIn: 'root'
})

export class ChannelDataService {

  private channelDataSubject: BehaviorSubject<ChannelDataInterface[]> = new BehaviorSubject<ChannelDataInterface[]>([]);
  public channelData$: Observable<ChannelDataInterface[]> = this.channelDataSubject.asObservable();

  channelData: ChannelDataInterface[] = [];

  constructor(
    public firestore: Firestore,
    private apiClient: APIClient,
    private userDataService: UserDataService,
  ) { }

  getChannelData(): Observable<ChannelDataInterface[]> {
    const channelCollection = collection(this.firestore, 'channels');
    const q = query(channelCollection);

    return new Observable<ChannelDataInterface[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const storedUserData: ChannelDataInterface[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const { channelName, channelDescription, color, createdByUser, users } = data;
          const channel: ChannelDataInterface = {
            id: doc.id,
            channelName: channelName,
            channelDescription: channelDescription,
            createdByUser: createdByUser,
            color: color,
            users: users,
          };
          storedUserData.push(channel);
        });

        this.channelDataSubject.next(storedUserData);
        observer.next(storedUserData);
      })

      return () => unsubscribe();
    });
  }

  createChannelData(channelName: string, channelDescription: string, channelColor: string, userId: number | null): void {
    const token = this.userDataService.getAccessToken();
    console.log("Valid access token from sgin in:", token)
    const requestBody = {
      channel_name: channelName,
      channel_description: channelDescription,
      channel_color: channelColor,
      user_id: userId
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.apiClient.postApiCreateChannel(requestBody, { headers }).subscribe({
      next: (response) => {
        console.log("Channel created successfully", response);
      },
      error: (error: any) => {
        console.error("Error creating channel", error);
      }
    });
  }

  sendChannelData(channel: ChannelDataInterface): Observable<void> {
    const channels = collection(this.firestore, 'channels');
    const channelData = {
      id: channel.id,
      channelName: channel.channelName,
      channelDescription: channel.channelDescription,
      color: channel.color,
      users: channel.users,
    };

    if (channel.id) {
      const docRef = doc(channels, channel.id);
      return from(updateDoc(docRef, channelData)).pipe(
        map(() => {
          this.channelDataSubject.next(this.channelData);
        })
      );
    } else {
      return from(addDoc(channels, channelData)).pipe(
        map(() => {
          this.channelDataSubject.next(this.channelData);
        })
      );
    }
  }
}
