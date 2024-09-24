import { Component, OnInit } from '@angular/core';
import { UserDataService, UserDataInterface } from '../service-moduls/user.service';
import { ChannelDataService, ChannelDataInterface } from '../service-moduls/channel.service';
import { ChannelDataResolverService } from '../service-moduls/channel-data-resolver.service';
import { UserDataResolveService } from '../service-moduls/user-data-resolve.service';
import { ChatBehaviorService } from '../service-moduls/chat-behavior.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { DirectMessageToUserService } from '../service-moduls/direct-message-to-user.service';
import { DirectMessageService, DirectMessageInterface } from '../service-moduls/direct-message.service';
import { BreakpointObserver } from '@angular/cdk/layout';


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
  availableChannels: ChannelDataInterface[] = [];

  channelId: string = '';
  selectedUserType: string = '';
  createByUser: string = '';
  selectedChannel: ChannelDataInterface | null = null;
  selectedUser: UserDataInterface | null = null;
  selectedDirectChat: DirectMessageInterface | null = null;

  constructor(
    private firestore: Firestore,
    private userDataService: UserDataService,
    private channelDataService: ChannelDataService,
    private channelDataResolver: ChannelDataResolverService,
    private directMessageService: DirectMessageService,
    private userDataResolver: UserDataResolveService,
    public chatBehavior: ChatBehaviorService,
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
    this.getUserData();
    this.userDataService.getUserData()
  }

  channelForm = new FormGroup({
    channelName: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
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

  submitChannel() {
    if (this.channelForm) {
      const currentUserId = this.userDataService.getCurrentUserId();
      const channelName = this.channelForm.value.channelName || '';
      const channelDescription = this.channelForm.value.channelDescription || '';
      const userId = currentUserId;
      const color = this.newColor()

      this.channelDataService.createChannelData(channelName, channelDescription, color, userId);
      this.channelForm.reset();
      this.channelCard = false;
      this.userCard = true;
    }
  }

  async getUserData() {
    this.userDataService.getUserDataQueryOld().subscribe(
      userData => {
        this.userData = userData;
        /* console.log('Subscribed data users:', userData); */
      },
      error => {
        console.error('Error retrieving user data:', error);
      }
    );
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
    this.selectedChannel = this.getChannelById(channelId);
    this.channelDataResolver.sendDataChannels(this.selectedChannel);
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

  selectChannelFromList(channelGroupId: any) {
    this.selectedChannel = this.getChannelById(channelGroupId);
  }

  triggerDirectChat() {
    this.chatBehavior.triggerChat();
  }

  getChannelById(channelId: any) {
    return this.channelData.find(channel => channel.id === channelId) || null;
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

  submitUser() {
    if (this.userForm) {
      const currentChannel = this.channelDataService.getCurrentChannelId();
      console.log("Log the current channel ID:", currentChannel);
      const userName = this.userForm.value.userName?.toLowerCase();
      if (this.selectedUserType === 'addByUser') {
        const userData = this.userDataService.getUserData()
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
        } else {
          console.log('No matching user found.');
        }
      }
    }
  }

  /* if (this.selectedChannel) {
    try {
      const matchingChannelFromList = this.selectedChannel;
      const users = matchingChannelFromList.users;
      if (!(matchingChannelFromList && this.selectedUserType === 'addFromGroup')) {
        console.log('User not found.');
        return;
      }
  }

  async addUserToChannel(users: string[], userName: string) {
    try {
      const channelDoc = doc(this.firestore, 'channels', this.channelId);
      const filteredUsers = users.filter(user => user !== userName);
      console.log(filteredUsers);
      await updateDoc(channelDoc, {
        users: arrayUnion(...filteredUsers)
      });
      console.log('User added successfully.');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async addGroupToChannel(userGroup: string[]) {
    try {
      const channelDoc = doc(this.firestore, 'channels', this.channelId);
      const usersToAdd = userGroup;
      await updateDoc(channelDoc, {
        users: arrayUnion(...usersToAdd)
      });
      console.log('Users added successfully.');
    } catch (error) {
      console.error('Error adding users:', error);
    }
    this.userCard = false;
  } */
}



