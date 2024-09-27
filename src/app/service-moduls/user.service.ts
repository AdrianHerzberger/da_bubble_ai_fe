import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, collection, doc, getDoc, getDocs, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { APIClient } from 'output';
import { GetAllUsersResponse, GetUserByEmailResponse, GetUserByIdResponse } from 'output/models/types';
import { BehaviorSubject, EMPTY, Observable, catchError, from, map, of, tap } from 'rxjs';

export interface UserDataInterface {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt?: any;
  status?: any;
}

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  userData: UserDataInterface[] = [];
  private userDataResolved: GetAllUsersResponse[] = [];

  public userId: number | null = null;
  private accessToken: string | null = null;

  private userDataSubject = new BehaviorSubject<GetUserByIdResponse | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor(
    public firestore: Firestore,
    private router: Router,
    private apiClient: APIClient,
  ) {
  }

  createProfileAvatar() {
    const randomAvatarNumber = Math.floor(Math.random() * 6) + 1;
    const profilePictureUrl = `./assets/profile-pictures/avatar${randomAvatarNumber}.png`;
    return profilePictureUrl;
  }

  getCurrentUserById(userId: number | null): Observable<GetUserByIdResponse> {
    return this.apiClient.getApiUserId({ user_id: userId }).pipe(
      tap(response => {
        const userData = response
        if (userData) {
          this.userDataSubject.next(userData);
        } else {
          console.error('User ID not found in response.');
        }
      }));
  }

  getCurrentUserId(): number | null {
    const currentUser = this.userDataSubject.value;
    return currentUser ? currentUser.user_id : null;
  }

  storedAccessToken(token: string): void {
    this.accessToken = token
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getCurrentUserByEmail(userEmail: string): void {
    this.apiClient.getApiUserEmail({ user_email: userEmail }).subscribe({
      next: (response) => {
        const userId = response.user_id;
        if (userId) {
          this.getCurrentUserById(userId);
          this.router.navigate([
            `/board/${userId}`,
            {
              outlets: {
                primary: ['header'],
                channels: ['channels'],
                chat: ['chat'],
                thread : ['thread']
              }
            }
          ]);

        } else {
          console.error('User ID not found in response.');
        }
      },
      error: (error) => {
        console.error('Error retrieving user data:', error);
      }
    });
  }

  getUserData(): Observable<GetAllUsersResponse[]> {
    return this.apiClient.getApiAllUsers().pipe(
      tap ((response: GetAllUsersResponse[]) => {
        this.userDataResolved = response;
        console.log('Get all user data successfully:', response);
      }),
      catchError(() => {
        return of([]);
      })
    );
  }

  getUserDataQueryOld(): Observable<UserDataInterface[]> {
    const userCollection = collection(this.firestore, 'users');
    const q = query(userCollection);

    return from(getDocs(q)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        const storedUserData: UserDataInterface[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const { name, email, picture, status } = data;
          const user: UserDataInterface = {
            id: doc.id,
            name: name,
            email: email,
            picture: picture,
            status: status
          };
          storedUserData.push(user);
        });
        this.userData = storedUserData;
        return storedUserData;
      })
    );
  }


  /*------ Current-User / Users ------*/
  currentUser: string = '';
  userName: string = '';
  userEmail: string = '';
  userStatus: string = '';
  userPicture: string = '';
  userProfilePicture: string = '';

  /**
   * Asynchronously retrieves the current user's data based on the provided userID.
   * @param {string} userID - The ID of the user whose data is to be retrieved in the 'users' collection.
   */
  async getCurrentUserDataUID(userID: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', userID);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        if (this.currentUser === userID) {
          this.currentUserData(userData);
        }
      }
    } catch (error) {
      //console.log('ERROR retrieving user data:', error);
    }
  }

  /**
   * Asynchronously retrieves user data from the backend based on the provided userID.
   * @param {string} userID - The ID of the user whose data is to be retrieved in the 'users' collection. 
   * @returns {Promise<Object|null>} - A promise that resolves with the retrieved user data object if it exists, or null if not found.
   */
  async usersDataBackend(userID: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', userID);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.log('ERROR retrieving user data:', error);
      return null;
    }
  }

  /*------ Help functions ------*/
  currentUserData(userData: any) {
    this.userName = userData['name'];
    this.userEmail = userData['email'];
    this.userStatus = userData['status'];
    this.userPicture = userData['picture'];
  }

}
