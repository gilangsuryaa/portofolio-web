'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import EducationSection from '@/components/Education';
import ProjectsSection from '@/components/Projects';
import SkillsSection from '@/components/Skills';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { getProfile, getEducation, getSkills, getProjects } from '@/lib/data-service';
import { Profile, Education, Skill, Project } from '@/lib/types';
import { initialProfile, initialEducation, initialSkills, initialProjects } from '@/lib/supabase/fallback-data';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [educationList, setEducationList] = useState<Education[]>(initialEducation);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, eduData, skillData, projData] = await Promise.all([
          getProfile(),
          getEducation(),
          getSkills(),
          getProjects(),
        ]);
        if (profData) setProfile(profData);
        if (eduData && eduData.length > 0) setEducationList(eduData);
        if (skillData && skillData.length > 0) setSkills(skillData);
        if (projData && projData.length > 0) setProjects(projData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bento-bg)] text-[var(--bento-text)]">
      <Navbar profile={profile} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Hero profile={profile} />
        <About profile={profile} />
        <EducationSection educationList={educationList} />
        <ProjectsSection projects={projects} />
        <SkillsSection skills={skills} />
        <ContactForm profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
