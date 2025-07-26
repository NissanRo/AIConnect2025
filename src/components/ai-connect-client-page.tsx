'use client';

import { useState, useEffect, useTransition } from 'react';
import type { FC } from 'react';
import { useToast } from "@/hooks/use-toast"
import type { Project, Application } from '@/lib/types';
import Header from '@/components/header';
import AboutSection from '@/components/about-section';
import ProjectCard from '@/components/project-card';
import InterestForm from '@/components/interest-form';
import ApplicationsTable from '@/components/admin/applications-table';
import Footer from '@/components/footer';
import { AdminLoginModal } from '@/components/modals/admin-login-modal';
import { SubmissionConfirmModal } from '@/components/modals/submission-confirm-modal';
import { AiSuggestionModal } from '@/components/modals/ai-suggestion-modal';
import { addApplication } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

interface AIConnectClientPageProps {
  initialProjects: Project[];
  initialApplications: Application[];
}

const AIConnectClientPage: FC<AIConnectClientPageProps> = ({ initialProjects, initialApplications }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  // State for modals
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [isAiSuggestModalOpen, setAiSuggestModalOpen] = useState(false);

  // State for data passing to modals
  const [aiSuggestionProfile, setAiSuggestionProfile] = useState<{ specialization: string, skills: string }>({ specialization: '', skills: '' });

  // Admin login logic
  const [logoClickCount, setLogoClickCount] = useState(0);
  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => setLogoClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 5) {
      setLogoClickCount(0);
      setLoginModalOpen(true);
    }
  };

  const handleLogin = (values: { username: string, password?: string }) => {
    if (values.username === 'admin' && values.password === 'password') {
      setIsAdmin(true);
      setLoginModalOpen(false);
      toast({ title: "Admin Login Successful", description: "Welcome back!" });
      return true;
    }
    return false;
  };
  
  // Application handler
  const handleAddApplication = async (application: Omit<Application, 'id'>) => {
    setIsLoading(true);
    try {
        const newApplication = await addApplication(application);
        setApplications([...applications, newApplication]);
        setSubmissionModalOpen(true);
    } catch (error) {
        toast({ title: "Error", description: "Failed to submit your interest. Please try again.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  // AI Suggestion handler
  const handleGetAISuggestions = (specialization: string, skills: string) => {
    setAiSuggestionProfile({ specialization, skills });
    setAiSuggestModalOpen(true);
  };

  const renderProjectSkeletons = () => (
    [...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    ))
  );

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Header onLogoClick={handleLogoClick} />
        <AboutSection />
        
        <section className="max-w-4xl mx-auto my-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Internship Opportunity: AI & Automation Projects</h2>
            <p className="text-muted-foreground">
                Each project has clearly defined deliverables and a long-term roadmap. Interns will contribute to building MVPs and full-scale implementations.
            </p>
        </section>

        {isAdmin && <ApplicationsTable applications={applications} />}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {projects.length === 0 ? renderProjectSkeletons() : projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>

        <InterestForm 
          projects={projects}
          onSubmit={handleAddApplication}
          onGetAISuggestions={handleGetAISuggestions}
          isSubmitting={isLoading}
        />

        <Footer />
      </div>

      {/* Modals */}
      <AdminLoginModal isOpen={isLoginModalOpen} onOpenChange={setLoginModalOpen} onLogin={handleLogin} />
      <SubmissionConfirmModal isOpen={isSubmissionModalOpen} onOpenChange={setSubmissionModalOpen} />
      <AiSuggestionModal isOpen={isAiSuggestModalOpen} onOpenChange={setAiSuggestModalOpen} {...aiSuggestionProfile} />
    </>
  );
};

export default AIConnectClientPage;
