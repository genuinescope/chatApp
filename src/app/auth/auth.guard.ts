import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { tap, map, first } from 'rxjs/operators';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthServiceService,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        let isAuthenticated = this.authService.getAuthStatus();
        console.log(isAuthenticated);
        if (!isAuthenticated) {
            this.router.navigate(['/login']);
        }
 
        return isAuthenticated;



    }
}
