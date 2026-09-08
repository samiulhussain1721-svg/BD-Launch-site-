export type JewelleryCategory = 
  | 'Engagement Rings' 
  | 'Bracelets' 
  | 'Necklaces' 
  | 'Wedding Rings' 
  | 'Earrings';

export interface Ring {
  id: string;
  tag: string;
  title: string;
  category?: JewelleryCategory;
  img: string;
  desc: string;
  cta: string;
  isCustomLink?: boolean;
}

export interface VaultPost {
  id: string;
  img: string;
  caption: string;
  category: 'Engagement Ring' | 'Loose Diamond' | 'Workshop / Crafting' | 'Fine Jewellery';
  carat: string;
  cut: string;
  metal: string;
  likes: number;
  comments: number;
}

export type GazetteCategory = 
  | 'Diamond Education'
  | 'Bespoke Stories'
  | 'Sizing & Guides'
  | 'Jewellery Quarter Notes';

export interface GazetteArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: GazetteCategory;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: string;
  status: 'published' | 'draft';
  metaDescription: string;
  seoKeywords: string[];
  content: string;
  updatedAt?: string;
}

export interface EnquiryBrief {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  pieceType?: string;
  shape?: string;
  carat?: string;
  length?: string;
  style?: string;
  designType?: string;
  metalPreference?: string;
  notes?: string;
  uploadedFiles?: { name: string; size: number; type: string }[];
  selectedPost?: VaultPost | null;
  createdAt: string;
}

