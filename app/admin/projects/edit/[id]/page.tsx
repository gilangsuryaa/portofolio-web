'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProjects } from '@/lib/data-service';
import { Project } from '@/lib/types';
import ProjectForm from '@/components/ProjectForm';
import Link from 'next/link';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const all = await getProjects();
        const found = all.find((p) => p.id === id || p.slug === id);
        if (found) setProject(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Proyek tidak ditemukan.</h2>
        <Link href="/admin/projects" className="text-sm font-semibold text-red-600 hover:underline">
          Kembali ke Daftar Proyek
        </Link>
      </div>
    );
  }

  return <ProjectForm initialData={project} isNew={false} />;
}
