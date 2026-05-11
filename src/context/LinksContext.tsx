import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '@/src/api/client';

interface Category {
  name: string;
  id: string;
}

interface LinkItem {
  id: string;
  linkUrl: string;
  title: string;
  description?: string;
  category: Category;
  imageUrl?: string;
  siteName?: string;
  userId: string;
}

interface LinkMeta {
  siteName?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  imageUrl?: string;
}

interface LinksContextType {
  links: LinkItem[];
  loading: boolean;
  selectedCategory: Category | null;
  setSelectedCategory: (cat: Category) => void;
  fetchLinks: (categoryId: string) => Promise<void>;
  addLink: (data: { linkUrl: string; title: string; description?: string; category: Category; imageUrl?: string; siteName?: string }) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  getLinkMeta: (url: string) => Promise<LinkMeta>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const LinksContext = createContext<LinksContextType | null>(null);

export function LinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategoryState] = useState<Category | null>(null);

  const setSelectedCategory = useCallback((cat: Category) => {
    setSelectedCategoryState(cat);
    fetchLinks(cat.id);
  }, []);

  const fetchLinks = useCallback(async (categoryId: string) => {
    setLoading(true);
    try {
      const res = await api<{ success: boolean; links: LinkItem[] }>(`/api/v1/link/${categoryId}`, { auth: true });
      setLinks(res.links);
    } catch {
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLink = useCallback(async (data: { linkUrl: string; title: string; description?: string; category: Category; imageUrl?: string; siteName?: string }) => {
    const res = await api<{ success: boolean; link: LinkItem; categoryId: string }>('/api/v1/link', {
      method: 'POST',
      body: data as Record<string, unknown>,
      auth: true,
    });
    if (res.categoryId === selectedCategory?.id) {
      setLinks(prev => [res.link, ...prev]);
    }
  }, [selectedCategory]);

  const deleteLink = useCallback(async (id: string) => {
    await api(`/api/v1/link/${id}`, { method: 'DELETE', auth: true });
    setLinks(prev => prev.filter(l => l.id !== id));
  }, []);

  const getLinkMeta = useCallback(async (url: string): Promise<LinkMeta> => {
    const res = await api<{ success: boolean; meta: LinkMeta }>('/api/v1/link/meta', {
      method: 'POST',
      body: { linkUrl: url },
    });
    return res.meta;
  }, []);

  const addCategory = useCallback(async (name: string) => {
    const res = await api<{ success: boolean; user: { categories: Category[] } }>('/api/v1/user/category', {
      method: 'PUT',
      body: { name },
      auth: true,
    });
    return;
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await api(`/api/v1/user/category/${id}`, { method: 'DELETE', auth: true });
  }, []);

  return (
    <LinksContext.Provider value={{ links, loading, selectedCategory, setSelectedCategory, fetchLinks, addLink, deleteLink, getLinkMeta, addCategory, deleteCategory }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const ctx = useContext(LinksContext);
  if (!ctx) throw new Error('useLinks must be used within LinksProvider');
  return ctx;
}
