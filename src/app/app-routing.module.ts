import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BoardComponent } from './board/board.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthActionComponent } from './auth-action/auth-action.component';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LegalComponent } from './legal/legal.component';
import { ChannelsComponent } from './channels/channels.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { userResolve } from './resolvers/user-resolver';
import { ChatComponent } from './chat/chat.component';
import { ThreadsComponent } from './threads/threads.component';


const routes: Routes = [
  { path: '', component: StartscreenComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'auth-action', component: AuthActionComponent },
  {
    path: 'board/:userId',
    component: BoardComponent,
    resolve: { user: userResolve },
    children: [
      {
        path: 'header',
        component: HeaderBarComponent,  
        outlet: 'primary',
      },
      {
        path: 'channels',
        component: ChannelsComponent,  
        outlet: 'channels',
      },
      {
        path: 'chat',
        component: ChatComponent,
        outlet: 'chat',
      },
      {
        path: 'thread',
        component: ThreadsComponent,
        outlet: 'thread',
      }
    ]
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'legal', component: LegalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
