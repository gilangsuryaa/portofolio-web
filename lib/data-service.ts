import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabase/client';
import { initialProfile, initialEducation, initialSkills, initialProjects } from './supabase/fallback-data';
import { Profile, Education, Skill, Project, ContactMessage } from './types';

// Helper to access localStorage in client
function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`porto_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`porto_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to store data in localStorage', err);
  }
}

// ---------------- PROFILE ----------------
export async function getProfile(): Promise<Profile> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('profile').select('*').single();
      if (!error && data) return data as Profile;
    } catch (err) {
      console.warn('Supabase fetch profile error, using fallback:', err);
    }
  }
  return getStoredData<Profile>('profile', initialProfile);
}

export async function updateProfile(profile: Partial<Profile>): Promise<{ success: boolean; data?: Profile; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('profile').upsert({ id: '1', ...profile, updated_at: new Date().toISOString() }).select().single();
      if (error) throw error;
      return { success: true, data: data as Profile };
    } catch (err: any) {
      console.error('Supabase update profile error:', err);
      return { success: false, error: err.message };
    }
  }

  // Fallback update
  const current = getStoredData<Profile>('profile', initialProfile);
  const updated = { ...current, ...profile };
  setStoredData('profile', updated);
  return { success: true, data: updated };
}

// ---------------- EDUCATION ----------------
export async function getEducation(): Promise<Education[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) return data as Education[];
    } catch (err) {
      console.warn('Supabase fetch education error, using fallback:', err);
    }
  }
  return getStoredData<Education[]>('education', initialEducation);
}

export async function saveEducationItem(item: Partial<Education>): Promise<{ success: boolean; data?: Education; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('education').upsert(item).select().single();
      if (error) throw error;
      return { success: true, data: data as Education };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Education[]>('education', initialEducation);
  let updatedList: Education[];
  let savedItem: Education;

  if (item.id) {
    savedItem = { ...current.find(e => e.id === item.id)!, ...item } as Education;
    updatedList = current.map(e => e.id === item.id ? savedItem : e);
  } else {
    savedItem = {
      id: `edu-${Date.now()}`,
      institution: item.institution || '',
      period: item.period || '',
      description_id: item.description_id || '',
      description_en: item.description_en || '',
      order_index: item.order_index ?? current.length + 1,
    };
    updatedList = [...current, savedItem];
  }
  setStoredData('education', updatedList);
  return { success: true, data: savedItem };
}

export async function deleteEducationItem(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('education').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Education[]>('education', initialEducation);
  const filtered = current.filter(e => e.id !== id);
  setStoredData('education', filtered);
  return { success: true };
}

// ---------------- SKILLS ----------------
export async function getSkills(): Promise<Skill[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) return data as Skill[];
    } catch (err) {
      console.warn('Supabase fetch skills error, using fallback:', err);
    }
  }
  return getStoredData<Skill[]>('skills', initialSkills);
}

export async function saveSkillItem(item: Partial<Skill>): Promise<{ success: boolean; data?: Skill; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('skills').upsert(item).select().single();
      if (error) throw error;
      return { success: true, data: data as Skill };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Skill[]>('skills', initialSkills);
  let savedItem: Skill;
  let updatedList: Skill[];

  if (item.id) {
    savedItem = { ...current.find(s => s.id === item.id)!, ...item } as Skill;
    updatedList = current.map(s => s.id === item.id ? savedItem : s);
  } else {
    savedItem = {
      id: `skill-${Date.now()}`,
      name: item.name || '',
      icon_url: item.icon_url || '',
      category: item.category || 'General',
      order_index: item.order_index ?? current.length + 1,
    };
    updatedList = [...current, savedItem];
  }
  setStoredData('skills', updatedList);
  return { success: true, data: savedItem };
}

export async function deleteSkillItem(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Skill[]>('skills', initialSkills);
  setStoredData('skills', current.filter(s => s.id !== id));
  return { success: true };
}

// ---------------- PROJECTS ----------------

// Cache proyek di memori untuk sesi berjalan.
// Halaman beranda sudah mengambil seluruh proyek, jadi saat pengunjung membuka
// salah satu studi kasus datanya sebenarnya sudah ada. Tanpa cache ini halaman
// detail memunculkan spinner dan mengambil ulang data yang sama — dan yang lebih
// penting, gambar tujuan shared element transition belum ada di DOM saat browser
// mengambil snapshot, sehingga morph-nya gagal diam-diam.
let projectCache: Project[] = [];

function cacheProjects(list: Project[]) {
  if (list && list.length > 0) projectCache = list;
}

/** Pembacaan sinkron, untuk render pertama sebelum data segar tiba. */
export function getCachedProjectBySlug(slug: string): Project | null {
  return projectCache.find(p => p.slug === slug) || null;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (!error && data && data.length > 0) {
        cacheProjects(data as Project[]);
        return data as Project[];
      }
    } catch (err) {
      console.warn('Supabase fetch projects error, using fallback:', err);
    }
  }
  const stored = getStoredData<Project[]>('projects', initialProjects);
  cacheProjects(stored);
  return stored;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (!error && data) {
        const fresh = data as Project;
        projectCache = [...projectCache.filter(p => p.slug !== slug), fresh];
        return fresh;
      }
    } catch (err) {
      console.warn('Supabase fetch project slug error, using fallback:', err);
    }
  }
  const list = getStoredData<Project[]>('projects', initialProjects);
  return list.find(p => p.slug === slug) || null;
}

export async function saveProject(project: Partial<Project>): Promise<{ success: boolean; data?: Project; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').upsert(project).select().single();
      if (error) throw error;
      return { success: true, data: data as Project };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Project[]>('projects', initialProjects);
  let saved: Project;
  let updatedList: Project[];

  if (project.id) {
    saved = { ...current.find(p => p.id === project.id)!, ...project } as Project;
    updatedList = current.map(p => p.id === project.id ? saved : p);
  } else {
    saved = {
      id: `proj-${Date.now()}`,
      slug: project.slug || `project-${Date.now()}`,
      title: project.title || 'New Project',
      category_id: project.category_id || '',
      category_en: project.category_en || '',
      description_id: project.description_id || '',
      description_en: project.description_en || '',
      cover_image: project.cover_image || '/img/optimized/portfolio/home.webp',
      overview_id: project.overview_id || '',
      overview_en: project.overview_en || '',
      role_id: project.role_id || '',
      role_en: project.role_en || '',
      tools: project.tools || '',
      timeline_id: project.timeline_id || '',
      timeline_en: project.timeline_en || '',
      process_id: project.process_id || '',
      process_en: project.process_en || '',
      challenge_id: project.challenge_id || '',
      challenge_en: project.challenge_en || '',
      challenge_images: project.challenge_images || [],
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      order_index: project.order_index ?? current.length + 1,
      featured: project.featured ?? true,
    };
    updatedList = [...current, saved];
  }
  setStoredData('projects', updatedList);
  return { success: true, data: saved };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<Project[]>('projects', initialProjects);
  setStoredData('projects', current.filter(p => p.id !== id));
  return { success: true };
}

// ---------------- CONTACT MESSAGES ----------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (err) {
      console.warn('Supabase fetch messages error:', err);
    }
  }
  return getStoredData<ContactMessage[]>('messages', []);
}

export async function submitContactMessage(message: { name: string; email: string; message: string }): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  // Supabase aktif: pesan baru dianggap terkirim kalau benar-benar masuk database.
  // Jangan jatuh ke localStorage — pesannya akan tersimpan di browser pengunjung
  // dan tidak akan pernah sampai ke halaman admin.
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert([
        {
          name: message.name,
          email: message.email,
          message: message.message,
          is_read: false,
        }
      ]);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error('Supabase submit message error:', err);
      // Pesan error aslinya sengaja tidak diteruskan ke pengunjung agar detail
      // internal tidak bocor; ContactForm menampilkan teks ramah dwibahasa.
      return { success: false };
    }
  }

  // Supabase belum dikonfigurasi — mode lokal untuk development.
  const current = getStoredData<ContactMessage[]>('messages', []);
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: message.name,
    email: message.email,
    message: message.message,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  setStoredData('messages', [newMessage, ...current]);
  return { success: true };
}

export async function markMessageRead(id: string, is_read: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').update({ is_read }).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<ContactMessage[]>('messages', []);
  setStoredData('messages', current.map(m => m.id === id ? { ...m, is_read } : m));
  return { success: true };
}

export async function deleteMessage(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const current = getStoredData<ContactMessage[]>('messages', []);
  setStoredData('messages', current.filter(m => m.id !== id));
  return { success: true };
}
