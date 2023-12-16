import { PostProps } from "../services/Post";
import PostCard from "./PostCard";

interface FeedPropsInterface {
  postsList: PostProps[];
  getAllPosts: () => Promise<void>;

  handleNewReply?: (newReply: PostProps, transactionCreatorId: string) => void;
}

const FeedComponent = ({ postsList, getAllPosts, handleNewReply }: FeedPropsInterface) => {
  const sortedPostList = postsList.sort((a, b) => {
    return b.timestamp! - a.timestamp!;
  });

  const renderedPosts = sortedPostList.map((post) => <PostCard handleNewReply={handleNewReply} post={post} getAllPosts={getAllPosts} />);

  return <>{postsList.length > 0 && renderedPosts}</>;
};

export default FeedComponent;
