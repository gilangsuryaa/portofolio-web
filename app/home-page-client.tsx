'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import EducationSection from '@/components/Education';
import ProjectsSection from '@/components/Projects';
import CertificatesSection from '@/components/Certificates';
import SkillsSection from '@/components/Skills';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { Profile, Education, Skill, Project, Certificate } from '@/lib/types';
import { subscribeToRealtime } from '@/lib/supabase/client';
import { getProfile, getEducation, getSkills, getProjects, getCertificates } from '@/lib/data-service';

interface HomePageClientProps {
  initialProfile: Profile;
  initialEducation: Education[];
  initialSkills: Skill[];
  initialProjects: Project[];
  initialCertificates: Certificate[];
}

export default function HomePageClient({
  initialProfile,
  initialEducation,
  initialSkills,
  initialProjects,
  initialCertificates,
}: HomePageClientProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [educationList, setEducationList] = useState<Education[]>(initialEducation);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);

  useEffect(() => {
    if (!window) return;

    const handleRealtimeChange = async () => {
      try {
        const [newProfile, newEducation, newSkills, newProjects, newCertificates] = await Promise.all([
          getProfile(),
          getEducation(),
          getSkills(),
          getProjects(),
          getCertificates()
        ]);
        setProfile(newProfile);
        setEducationList(newEducation);
        setSkills(newSkills);
        setProjects(newProjects);
        setCertificates(newCertificates);
      } catch (err) {
        console.error('Failed to refresh data on realtime change:', err);
      }
    };

    const unsubProfile = subscribeToRealtime('profile', '*', handleRealtimeChange);
    const unsubEducation = subscribeToRealtime('education', '*', handleRealtimeChange);
    const unsubSkills = subscribeToRealtime('skills', '*', handleRealtimeChange);
    const unsubProjects = subscribeToRealtime('projects', '*', handleRealtimeChange);
    const unsubCertificates = subscribeToRealtime('certificates', '*', handleRealtimeChange);

    return () => {
      unsubProfile();
      unsubEducation();
      unsubSkills();
      unsubProjects();
      unsubCertificates();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bento-bg)] text-[var(--bento-text)]">
      <Navbar profile={profile} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Hero profile={profile} />
        <About profile={profile} />
        <EducationSection educationList={educationList} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <SkillsSection skills={skills} />
        <ContactForm profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}