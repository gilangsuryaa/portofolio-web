'use client';

import React from 'react';
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
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bento-bg)] text-[var(--bento-text)]">
      <Navbar profile={initialProfile} />
      
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Hero profile={initialProfile} />
        <About profile={initialProfile} />
        <EducationSection educationList={initialEducation} />
        <ProjectsSection projects={initialProjects} />
        <CertificatesSection certificates={initialCertificates} />
        <SkillsSection skills={initialSkills} />
        <ContactForm profile={initialProfile} />
      </main>

      <Footer profile={initialProfile} />
    </div>
  );
}