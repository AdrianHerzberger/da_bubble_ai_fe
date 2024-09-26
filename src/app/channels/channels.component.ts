import { Component, OnInit } from '@angular/core';
import { UserDataService, UserDataInterface } from '../service-moduls/user.service';
import { ChannelDataService, ChannelDataInterface } from '../service-moduls/channel.service';
import { ChannelDataResolverService } from '../service-moduls/channel-data-resolver.service';
import { UserDataResolveService } from '../service-moduls/user-data-resolve.service';
import { ChatBehaviorService } from '../service-moduls/chat-behavior.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DirectMessageToUserService } from '../service-moduls/direct-message-to-user.service';
import { DirectMessageInterface } from '../service-moduls/direct-message.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { GetAllChannelsRespsonse, GetChannelAssociatedUserResponse, GetUserAssociatedChannelResponse } from 'output/models/types';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
  animations: [
    trigger('cardWidth', [
      state('closed', style({
        width: '0',
      })),
      state('open', style({
        width: '300px',
      })),
      transition('closed <=> open', animate('0.5s ease')),
    ]),
  ],
})

export class ChannelsComponent implements OnInit {
  showFiller: boolean = true;
  ChannelChatisOpen: boolean = true;
  openChannels: boolean = true;
  openDirect: boolean = true;
  channelCard: boolean = false;
  userCard: boolean = false;
  openUserForm: boolean = false;

  toggleChannelCard: boolean = true;

  userData: UserDataInterface[] = [];
  directChatData: UserDataInterface[] = [];
  channelData: ChannelDataInterface[] = [];

  selectedChannel: GetAllChannelsRespsonse | null = null;
  availableChannels: GetAllChannelsRespsonse[] = [];
  channelsAssociatedUser: GetChannelAssociatedUserResponse[] = [];
  userAssociatedList: GetUserAssociatedChannelResponse[] = [];

  selectedUserType: string = '';
  createByUser: string = '';
  selectedUser: UserDataInterface | null = null;
  selectedDirectChat: DirectMessageInterface | null = null;

  userId!: number | null;
  channelId!: number | null;

  constructor(
    private userDataService: UserDataService,
    private channelDataService: ChannelDataService,
    private channelDataResolver: ChannelDataResolverService,
    private userDataResolver: UserDataResolveService,
    public chatBehavior: ChatBehaviorService,
    private route: ActivatedRoute,
    public directMessageToUserService: DirectMessageToUserService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 420px)').subscribe(result => {
      if (result.matches) {
        this.chatBehavior.headerMoblieView = false;
      } else {
        this.chatBehavior.headerMoblieView = false;
      }
    });

    this.getRouterParamsUserId()    
    this.getChannelData();
  }

  channelForm = new FormGroup({
    channelName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]),
    channelDescription: new FormControl('', [
      Validators.required,
    ])
  });

  userForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
    ])
  });

  getRouterParamsUserId() {
    this.route.parent?.params.subscribe(params => {
      this.userId = +params['userId'];
      console.log('Received user ID from parent route:', this.userId);
    });

    if (this.userId) {
      return this.getChannelAssociatedUserData(this.userId);
    } else {
      return false
    }
  }

  getChannelAssociatedUserData(userId: number) {
    this.channelDataService.getChannelAssociatedUser(userId).subscribe({
      next: (channelsAssociatedUser: GetChannelAssociatedUserResponse[]) => {
        this.channelsAssociatedUser = channelsAssociatedUser;
        if (this.availableChannels.length > 0) {
          this.selectedChannel = this.availableChannels[0];
          console.log("Selected channel:", this.selectedChannel?.channel_name);
        } else {
          this.selectedChannel = null;
        }
      },
      error: (error: any) => {
        console.error('Error fetching channels:', error);
      }
    })
    return this.selectedChannel
  }

  getUserAssociatedChannelData(channelId: number): Observable<GetUserAssociatedChannelResponse[]> {
    console.log("Channel id received:", channelId);
    return this.channelDataService.getUserAssociatedChannels(channelId);
  }
  
  getChannelData() {
    this.channelDataService.getChannelData().subscribe({
      next: (availableChannels: GetAllChannelsRespsonse[]) => {
        this.availableChannels = availableChannels;
      },
      error: (error: any) => {
        console.error('Error fetching channels:', error);
      }
    });
  }

  submitChannel() {
    if (this.channelForm.valid) {
      console.log("Form valid status:", this.channelForm.valid);
      const channelName = this.channelForm.value.channelName || '';
      const channelDescription = this.channelForm.value.channelDescription || '';
      const userId = this.userId;
      const color = this.newColor()

      this.channelDataService.createChannelData(channelName, channelDescription, color, userId);
      this.channelForm.reset();
      this.channelCard = false;
      this.userCard = true;
    }
  }

  toggle() {
    this.showFiller = !this.showFiller;
  }

  toggleChannel() {
    this.openChannels = !this.openChannels;
  }

  toggleDirect() {
    this.openDirect = !this.openDirect;
  }

  addChannel() {
    this.channelCard = true;
  }

  selectChannel(channelId: any) {
    //this.selectedChannel = this.getChannelById(channelId);
    //this.channelDataResolver.sendDataChannels(this.selectedChannel);
    this.updateChannelName(this.selectedChannel);
    this.directMessageToUserService.directMessageToUserOpen = false;
    this.chatBehavior.ChannelChatIsOpen = true;

    this.chatBehavior.hideChannel = true;
    this.chatBehavior.hideChat = false;
    this.chatBehavior.toggleDirectChatIcon = false;
    this.chatBehavior.toggleSearchBar = false;

    this.chatBehavior.isChatOpenResponsive = true;
    this.chatBehavior.isThreadOpenResponsive = false;
    this.chatBehavior.isDirectChatToUserOpenResponsive = false;
    if (window.innerWidth <= 420) {
      this.chatBehavior.headerMoblieView = true;
    }
  }

  openDirectMessageToUser(userId: any) {
    this.directMessageToUserService.setDirectMessageToUserId();
    this.chatBehavior.ChannelChatIsOpen = false;

    this.selectedUser = this.getUserById(userId);
    this.userDataResolver.sendDataUsers(this.selectedUser);

    this.chatBehavior.isChatOpenResponsive = false;
    this.chatBehavior.isThreadOpenResponsive = false;
    this.chatBehavior.isDirectChatToUserOpenResponsive = true;

    this.chatBehavior.hideChannel = true;
    this.chatBehavior.hideDirectChat = false;
    this.chatBehavior.toggleDirectChatIcon = false;
    if (window.innerWidth <= 420) {
      this.chatBehavior.headerMoblieView = true;
    }
  }

  /* selectDirectChat(directChatId: any) {
    const selectedDirectChat = this.getDirectChatById(directChatId);
    if (selectedDirectChat !== null) {
      this.selectedDirectChat = selectedDirectChat;
      this.directChatDataResolver.sendDataDirectChat(this.selectedDirectChat);
    }
  } */

  selectChannelFromList(channelId: number) {
    this.selectedChannel = this.availableChannels.find(channel => channel.channel_id === channelId) || null;
    console.log('Selected channel:', this.selectedChannel);
  }

  triggerDirectChat() {
    this.chatBehavior.triggerChat();
  }

  getChannelById(channelId: any) {
    return this.availableChannels.find(channel => channel.channel_id === channelId) || null;
  }

  getUserById(userId: any) {
    return this.userData.find(user => user.id === userId) || null;
  }

  getDirectChatById(directChatId: any) {
    return this.directChatData.find(directChat => directChat.id === directChatId) || null;
  }

  updateChannelName(channelToUpdate: any) {
    if (channelToUpdate && channelToUpdate.channelName) {
      const channelIndex = this.channelData.findIndex(channel => channel.id === channelToUpdate.id);
      if (channelIndex !== -1) {
        this.channelData[channelIndex].channelName = channelToUpdate.channelName;
      }
    }
  }

  newColor() {
    var randomColor = "#000000".replace(/0/g, () => {
      return (~~(Math.random() * 16)).toString(16);
    });
    return randomColor;
  }


  close() {
    this.channelCard = false;
  }

  addUser(value: string) {
    this.selectedUserType = value;
    if (value === 'addByUser') {
      this.openUserForm = true;
    } else if (value === 'addFromGroup') {
      this.openUserForm = false;
    }
    console.log("type", this.selectedUserType);
  }

  submitFormOptions() {
    const currentChannel = this.channelDataService.getCurrentChannelId();
    console.log("Log the current channel ID:", currentChannel);
    if (this.selectedUserType === 'addByUser') {
      if (this.userForm.valid) {
        const userName = this.userForm.value.userName?.toLowerCase();
        const userData = this.userDataService.getUserData();
        console.log('users found:', userData);

        if (!userData || userData.length === 0) {
          return;
        }

        const matchedUser = userData.find(user =>
          user.user_name.toLowerCase() === userName
        );

        if (matchedUser) {
          console.log(matchedUser.user_id)
          this.channelDataService.addUserAssociationToChannel(matchedUser.user_id, currentChannel);
          this.userCard = false;
        } else {
          console.log('No matching user found.');
        }
      }
    }
    else if (this.selectedUserType === 'addFromGroup') {
      if (this.selectedChannel) {
        const selectedChannelId = this.selectedChannel.channel_id;
        this.getUserAssociatedChannelData(selectedChannelId).subscribe({
          next: (userList: GetUserAssociatedChannelResponse[]) => {
            const userIds = userList.map(user => user.user_id);
            console.log('User IDs:', userIds);
            this.channelDataService.addUserAssociationToChannel(userIds, currentChannel);
          },
          error: (error: any) => {
            console.error('Error retrieving user list:', error);
          }
        });
        this.userCard = false;
      }
      else {
        console.log('No matching user found.');
      }
    }
  }
}



