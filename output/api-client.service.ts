/* tslint:disable */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { DefaultHttpOptions, HttpOptions, APIClientInterface } from './';
import {
  GetUserByEmailArgs,
  GetUserByEmailResponse,
  GetUserByIdArgs,
  GetUserByIdResponse,
  RegisterUserBody,
  RegisterUserResponse,
  SignInUserBody,
  SignInUserResponse,
  CreateChannelBody,
  CreateChannelResponse,
  GetAllUsersArgs,
  GetAllUsersResponse,
  GetChannelByIdArgs,
  GetChannelByIdResponse,
  CreateChannelUserAssociationBody,
  CreateChannelUserAssociationResponse
} from './models/types';


export const USE_DOMAIN = new InjectionToken<string>('APIClient_USE_DOMAIN');
export const USE_HTTP_OPTIONS = new InjectionToken<HttpOptions>('APIClient_USE_HTTP_OPTIONS');

type APIHttpOptions = HttpOptions & {
  headers: HttpHeaders;
  params: HttpParams;
  responseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
};

/**
 * Created with https://github.com/flowup/api-client-generator
 */
@Injectable()
export class APIClient implements APIClientInterface {

  readonly options: APIHttpOptions;

  readonly domain: string = `//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;

  constructor(private readonly http: HttpClient,
    @Optional() @Inject(USE_DOMAIN) domain?: string,
    @Optional() @Inject(USE_HTTP_OPTIONS) options?: DefaultHttpOptions) {

    if (domain != null) {
      this.domain = domain;
    }

    this.options = {
      headers: new HttpHeaders(options && options.headers ? options.headers : {}),
      params: new HttpParams(options && options.params ? options.params : {}),
      ...(options && options.reportProgress ? { reportProgress: options.reportProgress } : {}),
      ...(options && options.withCredentials ? { withCredentials: options.withCredentials } : {})
    };
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUserId(args: GetUserByIdArgs): Observable<GetUserByIdResponse> {
    const path = `/api/get_user_by_id/${args.user_id}`;
    const options: APIHttpOptions = {
      ...this.options,
    };

    return this.sendRequest<GetUserByIdResponse>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */
  getApiUserEmail(args: GetUserByEmailArgs): Observable<GetUserByEmailResponse> {
    const path = `/api/get_user_by_email/${args.user_email}`;
    const options: APIHttpOptions = {
      ...this.options,
    };
    return this.sendRequest<GetUserByEmailResponse>('GET', path, options);
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */

  getApiAllUsers(): Observable<GetAllUsersResponse[]> {
    const path = `/api/all_users`;
    const options: APIHttpOptions = {
      ...this.options
    }
    return this.sendRequest<GetAllUsersResponse[]>('GET', path, options)
  }

  /**
   * Response generated for [ 200 ] HTTP response code.
   */

  getApiChannelById(args: GetChannelByIdArgs): Observable<GetChannelByIdResponse> {
    const path = `/api/get_channel_by_id/${args.channel_id}`;
    const options: APIHttpOptions = {
      ...this.options
    }
    return this.sendRequest<GetChannelByIdResponse>('GET', path, options)
  }

  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiRegisterUser(body: RegisterUserBody): Observable<RegisterUserResponse> {
    const path = `/api/register_user`;
    const options: APIHttpOptions = {
      ...this.options,
    };

    return this.sendRequest<RegisterUserResponse>('POST', path, options, body);
  }

  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiSignInUser(body: SignInUserBody): Observable<SignInUserResponse> {
    const path = `/api/sign_in_user`;
    const options: APIHttpOptions = {
      ...this.options,
    }

    return this.sendRequest<SignInUserResponse>('POST', path, options, body);
  }

  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiCreateChannel(body: CreateChannelBody, options?: { headers?: HttpHeaders }): Observable<CreateChannelResponse> {
    const path = `/api/create_channel`;
    const requestOptions: APIHttpOptions = {
      ...this.options,
      headers: options?.headers || this.options.headers
    };

    return this.sendRequest<CreateChannelResponse>('POST', path, requestOptions, body);
  }

  /**
   * Response generated for [ 201 ] HTTP response code.
   */
  postApiChannelUserAssociation(body: CreateChannelUserAssociationBody): Observable<CreateChannelUserAssociationResponse> {
    const path = `/api/create_user_association_to_channel`;
    const options: APIHttpOptions = {
      ...this.options,
    };

    return this.sendRequest<CreateChannelUserAssociationResponse>('POST', path, options, body);
  }

  private sendRequest<T>(method: string, path: string, options: HttpOptions, body?: any): Observable<T> {
    switch (method) {
      case 'DELETE':
        return this.http.delete<T>(`${this.domain}${path}`, options);
      case 'GET':
        return this.http.get<T>(`${this.domain}${path}`, options);
      case 'HEAD':
        return this.http.head<T>(`${this.domain}${path}`, options);
      case 'OPTIONS':
        return this.http.options<T>(`${this.domain}${path}`, options);
      case 'PATCH':
        return this.http.patch<T>(`${this.domain}${path}`, body, options);
      case 'POST':
        return this.http.post<T>(`${this.domain}${path}`, body, options);
      case 'PUT':
        return this.http.put<T>(`${this.domain}${path}`, body, options);
      default:
        console.error(`Unsupported request: ${method}`);
        return throwError(`Unsupported request: ${method}`);
    }
  }
}
