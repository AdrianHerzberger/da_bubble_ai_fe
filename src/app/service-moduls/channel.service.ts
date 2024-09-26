import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { APIClient } from 'output';
import { BehaviorSubject, Observable, catchError, from, map, of, tap } from 'rxjs';
import { UserDataService } from './user.service';
import { HttpHeaders } from '@angular/common/http';
import { GetAllChannelsRespsonse, GetChannelAssociatedUserResponse, GetChannelByIdResponse } from 'output/models/types';
import { Router } from '@angular/router';

export interface ChannelDataInterface {
  id?: any;
  channelName: string;
  channelDescription: string;
  createdByUser?: string;
  color?: any;
  users?: any;
}

@Injectable({
  providedIn: 'root'
})

export class ChannelDataService {

  private channelDataSubject = new BehaviorSubject<GetChannelByIdResponse | null>(null);
  public channelData$ = this.channelDataSubject.asObservable();

  channelData: ChannelDataInterface[] = [];

  private channelDataResovler: GetAllChannelsRespsonse[] = []

  constructor(
    public firestore: Firestore,
    private router: Router,
    private apiClient: APIClient,
    private userDataService: UserDataService,
  ) { }

  getChannelDataOld(): Observable<ChannelDataInterface[]> {
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

        observer.next(storedUserData);
      })

      return () => unsubscribe();
    });
  }

  getCurrentChannelById(channelId: number) {
    this.apiClient.getApiChannelById({ channel_id: channelId }).subscribe({
      next: (response) => {
        const channelData = response;
        if (channelData) {
          this.channelDataSubject.next(channelData);
        } else {
          console.log('Channel ID not found in response.');
        }
      },
      error: (error) => {
        console.log('Error retrieving channel data', error);
      }
    });
  }

  getCurrentChannelId(): number | null {
    const currentChannel = this.channelDataSubject.value;
    return currentChannel ? currentChannel.channel_id : null;
  }

  createChannelData(channelName: string, channelDescription: string, channelColor: string, userId: number | null): void {
    const token = this.userDataService.getAccessToken();
    console.log("Valid access token from sign-in:", token)
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
        const channelId = response.channel_id
        if (channelId) {
          this.router.navigateByUrl(`/board/${userId}/channel/${channelId}`);
          this.getCurrentChannelById(channelId);
        }
      },
      error: (error: any) => {
        console.error("Error creating channel", error);
      }
    });
  }

  addUserAssociationToChannel(userId: number, channelId: number | null) {
    this.apiClient.postApiChannelUserAssociation({
      user_id: userId,
      channel_id: channelId,
    }).subscribe({
      next: (response) => {
        console.log('Channel user association created successfully:', response)
      },
      error: (error) => {
        console.log('Error creating channel user association.', error)
      }
    })
  }

  getChannelData(): Observable<GetAllChannelsRespsonse[]> {
    return this.apiClient.getApiAllChannels().pipe(
      tap((response: GetAllChannelsRespsonse[]) => {
        console.log('Get all channel data successfully:', response);
      }),
      catchError((error) => {
        console.error('Error getting channel data:', error);
        return of([]);
      })
    );
  }

  getChannelAssociatedUser(userId: number | null): Observable<GetChannelAssociatedUserResponse[]> {
    console.log('Id passed from route to channel association:', userId)
    return this.apiClient.getApiChannelAssociatedUser({ user_id: userId }).pipe(
      tap((response: GetChannelAssociatedUserResponse[]) => {
        console.log('Channel data with associated user successfully:', response);
      }),
      catchError((error) => {
        console.error('Error getting channel data with associated user:', error);
        return of([]);
      })
    );
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

        })
      );
    } else {
      return from(addDoc(channels, channelData)).pipe(
        map(() => {
        })
      );
    }
  }
}
