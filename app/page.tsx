import HomePageClient from '@/app/home-page-client';
import { getProfile, getEducation, getSkills, getProjects, getCertificates } from '@/lib/data-service';
import { initialProfile, initialEducation, initialSkills, initialProjects } from '@/lib/supabase/fallback-data';

export default async function HomePage() {
  const [profile, educationList, skills, projects, certificates] = await Promise.all([
    getProfile().catch(() => initialProfile),
    getEducation().catch(() => initialEducation),
    getSkills().catch(() => initialSkills),
    getProjects().catch(() => initialProjects),
    getCertificates().catch(() => []),
  ]);

  return (
    <HomePageClient
      initialProfile={profile}
      initialEducation={educationList}
      initialSkills={skills}
      initialProjects={projects}
      initialCertificates={certificates}
    />
  );
}
