import { useQuery } from '@tanstack/react-query';

import { fetchCommentsByPostId, fetchPostById, fetchPosts } from '@/api/postsApi';

export function useHomePosts() {
  return useQuery({
    queryKey: ['posts', 'home', 3],
    queryFn: () => fetchPosts(3),
  });
}

export function useAllPosts() {
  return useQuery({
    queryKey: ['posts', 'all'],
    queryFn: () => fetchPosts(),
  });
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
