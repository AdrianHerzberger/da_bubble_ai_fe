/* tslint:disable */

import { Observable } from 'rxjs';
import { HttpOptions } from './';
import {
  GetUserByIdArgs, GetUserByIdResponse,
  GetUserByEmailArgs, GetUserByEmailResponse,
  RegisterUserBody, RegisterUserResponse,
  SignInUserBody, SignInUserResponse,
  CreateChannelBody, CreateChannelResponse,
  GetAllUsersArgs, GetAllUsersResponse
} from './models/types';


export interface APIClientInterface {

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUsersUserId(args: GetUserByIdArgs): Observable<GetUserByIdResponse>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUserEmail(args: GetUserByEmailArgs): Observable<GetUserByEmailResponse>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getAllUsers(args: GetAllUsersArgs): Observable<GetAllUsersResponse[]>;

  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiRegisterUser(body: RegisterUserBody): Observable<RegisterUserResponse>;
  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiSignInUser(body: SignInUserBody): Observable<SignInUserResponse>;
  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiCreateChannel(body: CreateChannelBody): Observable<CreateChannelResponse>;

}
