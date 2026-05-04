import axios from 'axios';

const postsBase = 'https://jsonplaceholder.typicode.com';

export type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type JsonPlaceholderComment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export async function fetchCommentsByPostId(
  postId: number,
): Promise<JsonPlaceholderComment[]> {
  const { data } = await axios.get<JsonPlaceholderComment[]>(
    `${postsBase}/comments`,
    { params: { postId } },
  );
  return data;
}

export async function fetchPosts(
  limit?: number,
): Promise<JsonPlaceholderPost[]> {
  const { data } = await axios.get<JsonPlaceholderPost[]>(`${postsBase}/posts`, {
    params: limit != null ? { _limit: limit } : undefined,
  });
  return data;
}

export async function fetchPostById(
  id: number,
): Promise<JsonPlaceholderPost> {
  const { data } = await axios.get<JsonPlaceholderPost>(
    `${postsBase}/posts/${id}`,
  );
  return data;
}
