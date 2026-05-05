import { type QueryClient, useQuery } from '@tanstack/react-query';

import {
  fetchCommentsByPostId,
  fetchPostById,
  fetchPosts,
  type JsonPlaceholderPost,
} from '@/api/postsApi';

export const postsListQueryKey = ['posts', 'list'] as const;

export function usePostsList() {
  return useQuery({
    queryKey: postsListQueryKey,
    queryFn: () => fetchPosts(),
  });
}

export async function prefetchPostDetailAndComments(
  queryClient: QueryClient,
  postId: number,
): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['posts', 'detail', postId],
      queryFn: () => fetchPostById(postId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['posts', 'comments', postId],
      queryFn: () => fetchCommentsByPostId(postId),
    }),
  ]);
}

export async function prefetchPostsDetailAndCommentsBatched(
  queryClient: QueryClient,
  posts: JsonPlaceholderPost[],
  options?: { limit?: number; concurrency?: number },
): Promise<void> {
  const limit = options?.limit ?? posts.length;
  const concurrency = Math.max(1, options?.concurrency ?? 4);
  const slice = posts.slice(0, limit);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (true) {
      const i = cursor++;
      if (i >= slice.length) return;
      const p = slice[i];
      await prefetchPostDetailAndComments(queryClient, p.id);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

export function usePostDetail(id: number) {
  return useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => fetchPostById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: ['posts', 'comments', postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: Number.isFinite(postId) && postId > 0,
  });
}
