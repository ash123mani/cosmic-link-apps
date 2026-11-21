export interface Category {
  id: string;
  name: string;
}

export interface LinkItem {
  id: string;
  linkUrl: string;
  title: string;
  description?: string;
  category: Category;
  imageUrl?: string;
  siteName?: string;
  userId: string;
  sharedBy?: {
    id?: string;
    username?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkMeta {
  siteName?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  categories: Category[];
}

export const ALL_CATEGORY: Category = { id: 'all', name: 'All' };
export const SHARED_CATEGORY_ID = 'system-shared';
export const SHARED_CATEGORY_NAME = 'Shared';

export function isAllCategory(category?: Category | null): boolean {
  return category?.id === ALL_CATEGORY.id;
}

export function isSharedCategory(id?: string | null): boolean {
  return id === SHARED_CATEGORY_ID;
}

export function hostOf(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export interface UserSummary {
  id: string;
  username: string;
  email?: string;
}

export type ShareStatus = 'unseen' | 'seen' | 'moved';

export interface ShareItem {
  id: string;
  senderId: string;
  recipientId: string;
  originalLinkId?: string;
  savedLinkId: string;
  linkUrl: string;
  title?: string;
  description?: string;
  siteName?: string;
  imageUrl?: string;
  message?: string;
  status: ShareStatus;
  createdAt?: string;
  updatedAt?: string;
  sender?: UserSummary;
}


