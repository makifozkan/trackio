export type Session = {
  id: string;
  user_id?: string;
  session_token?: string;
  expires?: string;
  user_v2_id?: string;
  userv2?: UserV2;
};
