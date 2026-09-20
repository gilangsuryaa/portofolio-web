export interface Profile {
  id: string;
  name: string;
  title_id: string;
  title_en: string;
  tagline_id: string;
  tagline_en: string;
  about_id: string;
  about_en: string;
  avatar_url: string;
  logo_url: string;
  cv_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  location?: string;
  specialization?: string;
  current_school?: string;
  school_period?: string;
  specialization_1?: string;
  specialization_2?: string;
  specialization_3?: string;
  philosophy_id?: string;
  philosophy_en?: string;
  philosophy_desc_id?: string;
  philosophy_desc_en?: string;
  motto?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  period: string;
  description_id: string;
  description_en: string;
  order_index: number;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  icon_url: string;
  category?: string;
  order_index: number;
  created_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category_id: string;
  category_en: string;
  description_id: string;
  description_en: string;
  cover_image: string;
  overview_id?: string;
  overview_en?: string;
  role_id?: string;
  role_en?: string;
  tools?: string;
  timeline_id?: string;
  timeline_en?: string;
  process_id?: string;
  process_en?: string;
  challenge_id?: string;
  challenge_en?: string;
  challenge_images?: string[];
  github_url?: string;
  live_url?: string;
  order_index: number;
  featured: boolean;
  created_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued_date: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
