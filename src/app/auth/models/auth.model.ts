export interface LoginRequest {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  identity_source: string;
  id_token: string;
  token: string;
  grant_type: string;
}

export interface RegisterRequest {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  email: string;
}


export interface OAuth2Response {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  user_id: string;
}
