export type StoreBlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  lang?: string | null;
  published: boolean;
  publishAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/** Liste blog — sans content HTML. */
export type StoreBlogPostListItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverUrl?: string | null;
  lang?: string | null;
  published: boolean;
  publishAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UpsertBlogPostPayload = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  lang?: string;
  published?: boolean;
  publishAt?: string | null;
};
