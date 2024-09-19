export interface GetUserByIdArgs {
    userId: number;
}

export interface GetUserByIdResponse {
    id: number;
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
    user_name: string;
    user_email: string;
    user_password: string;
}

export interface RegisterUserResponse {
    user_name: string;
    user_email: string;
    user_password: string;
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
}


