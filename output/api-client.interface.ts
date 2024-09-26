/* tslint:disable */

import { Observable } from 'rxjs';
import { HttpOptions } from './';
import {
  GetUserByIdArgs, GetUserByIdResponse,
  GetUserByEmailArgs, GetUserByEmailResponse,
  RegisterUserBody, RegisterUserResponse,
  SignInUserBody, SignInUserResponse,
  CreateChannelBody, CreateChannelResponse,
  GetAllUsersArgs, GetAllUsersResponse,
  GetChannelByIdArgs, GetChannelByIdResponse,
  CreateChannelUserAssociationBody, CreateChannelUserAssociationResponse,
  GetAllChannelsArgs, GetAllChannelsRespsonse,
  GetChannelAssociatedUserArgs,
  GetChannelAssociatedUserResponse
} from './models/types';


export interface APIClientInterface {

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUserId(args: GetUserByIdArgs): Observable<GetUserByIdResponse>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUserEmail(args: GetUserByEmailArgs): Observable<GetUserByEmailResponse>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiAllUsers(args: GetAllUsersArgs): Observable<GetAllUsersResponse[]>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiChannelById(args: GetChannelByIdArgs): Observable<GetChannelByIdResponse>;

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiAllChannels(args: GetAllChannelsArgs): Observable<GetAllChannelsRespsonse[]>

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiChannelAssociatedUser(args: GetChannelAssociatedUserArgs): Observable<GetChannelAssociatedUserResponse[]>

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
  
   /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiChannelUserAssociation(body: CreateChannelUserAssociationBody): Observable<CreateChannelUserAssociationResponse>;

}
