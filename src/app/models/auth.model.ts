export interface TokenRequest {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
  identity_source: string;
  id_token: string;
  token: string;
}
