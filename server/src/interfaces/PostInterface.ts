export interface PostInterface {
  text: string;
  creator_address: string;
  transaction_id: string | null;
  timestamp: number | null;
  country: string | null;
  likes: number | [];
  replies: PostInterface[] | [];
}
