import type { QueryClient } from '@tanstack/react-query';

import type { JsonPlaceholderPost } from '@/api/postsApi';

export function seedPostDetailFromList(
  queryClient: QueryClient,
  post: JsonPlaceholderPost,
): void {
  queryClient.setQueryData(['posts', 'detail', post.id], post);
}
