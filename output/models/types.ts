export interface GetUserByIdArgs {
    userId: number;
}

export interface GetUserByIdResponse {
    userId: number;
    user_name: string;
    user_email: string;
    user_profile_picture_url: string;
}

export interface GetUserByEmailArgs {
    userEmail: string;
}

export interface GetUserByEmailResponse {
    id: number;
    user_name: string;
    user_email: string;
    user_profile_picture_url: string;
}

export interface RegisterUserBody {
    user_name: string | undefined;
    user_email: string;
    user_password: string;
}

export interface RegisterUserResponse {
    user_name: string | undefined;
    user_email: string;
    user_password: string;
}

export interface GetAllUsersArgs {
    user_id: number;
    user_email: number;
    user_name: string;
    user_profile_picture_url: string;
}

export interface GetAllUsersResponse {
    user_id: number;
    user_email: number;
    user_name: string;
    user_profile_picture_url: string;
}

export interface SignInUserBody {
    user_email: string;
    user_password: string;
    user_profile_picture_url: string;
}

export interface SignInUserResponse {
    user_email: string;
    user_password: string;
    user_profile_picture_url: string;
    access_token: string;
}

export interface CreateChannelBody {
    channel_name: string;
    channel_description: string;
    channel_color: string;
    user_id: number | null,
}

export interface CreateChannelResponse {
    channelId: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
    user_id: number | null,
}

export interface GetChannelByIdArgs {
    channelId: number;
}

export interface GetChannelByIdResponse {
    channel_name: string;
    channel_description: string;
    channel_color: string;
    user_id: number | null,
}


