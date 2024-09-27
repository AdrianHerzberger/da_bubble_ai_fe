import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, ResolveFn } from '@angular/router';
import { GetUserByIdResponse } from 'output/models/types';
import { EMPTY, Observable } from 'rxjs';
import { UserDataService } from '../service-moduls/user.service';


export const userResolve: ResolveFn<GetUserByIdResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userId = Number(route.paramMap.get('userId'));

    if (isNaN(userId) || userId <= 0) {
        console.error("Invalid userId provided");
        return EMPTY; 
    }

    return inject(UserDataService).getCurrentUserById(userId);
};
