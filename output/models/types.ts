export interface GetUserByIdArgs {
    user_id: number | null;
}

export interface GetUserByIdResponse {
    user_id: number;
    user_name: string;
    user_email: string;
    user_profile_picture_url: string;
}

export interface GetUserByEmailArgs {
    user_email: string;
}

export interface GetUserByEmailResponse {
    user_id: number;
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
    channel_id: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
    user_id: number | null,
}

export interface GetChannelByIdArgs {
    channel_id: number;
}

export interface GetChannelByIdResponse {
    channel_id: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
    user_id: number | null,
}

export interface CreateChannelUserAssociationBody {
    user_id: number;
    channel_id: number | null;
}

export interface CreateChannelUserAssociationResponse {
    user_id: number;
    channel_id: number | null;
}

export interface GetAllChannelsArgs {
    channel_id: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
}

export interface GetAllChannelsRespsonse {
    channel_id: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
}

export interface GetChannelAssociatedUserArgs {
    user_id: number | null;
}

export interface GetChannelAssociatedUserResponse {
    channel_id: number;
    channel_name: string;
    channel_description: string;
    channel_color: string;
}

