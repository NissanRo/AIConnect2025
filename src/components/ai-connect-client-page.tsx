
'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import type { Project, Application } from '@/lib/types';
import Header from '@/components/header';
import AboutSection from '@/components/about-section';
import ProjectCard from '@/components/project-card';
import InterestForm from '@/components/interest-form';
import ApplicationsTable from '@/components/admin/applications-table';
import Footer from '@/components/footer';
import { AdminLoginModal } from '@/components/modals/admin-login-modal';
import { ProjectModal } from '@/components/modals/project-modal';
import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { SubmissionConfirmModal } from '@/components/modals/submission-confirm-modal';
import { AiSuggestionModal } from '@/components/modals/ai-suggestion-modal';

interface AIConnectClientPageProps {
  initialProjects: Project[];
}

const AIConnectClientPage: FC<AIConnectClientPageProps> = ({ initialProjects }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();

  // State for modals
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [isAiSuggestModalOpen, setAiSuggestModalOpen] = useState(false);

  // State for data passing to modals
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
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
  
  const handleLogout = () => {
    setIsAdmin(false);
    toast({ title: "Logged Out", description: "You have returned to the main page." });
  };


  // Project CRUD handlers
  const handleSaveProject = (projectData: Omit<Project, 'id'>, id?: number) => {
    if (id !== undefined) {
      setProjects(projects.map(p => p.id === id ? { ...projectData, id } : p));
      toast({ title: "Project Updated", description: `"${projectData.title}" has been successfully updated.` });
    } else {
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
      setProjects([...projects, { ...projectData, id: newId }]);
      toast({ title: "Project Added", description: `"${projectData.title}" has been successfully added.` });
    }
    setProjectModalOpen(false);
    setProjectToEdit(null);
  };

  const openAddProjectModal = () => {
    setProjectToEdit(null);
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setProjectToEdit(project);
    setProjectModalOpen(true);
  };

  const openDeleteProjectModal = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      toast({ title: "Project Deleted", description: `Project "${projectToDelete.title}" has been removed.`, variant: "destructive" });
    }
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  // Application handler
  const handleAddApplication = (application: Application) => {
    setApplications([...applications, application]);
    setSubmissionModalOpen(true);
  };

  // AI Suggestion handler
  const handleGetAISuggestions = (specialization: string, skills: string) => {
    setAiSuggestionProfile({ specialization, skills });
    setAiSuggestModalOpen(true);
  };


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

        {isAdmin && (
          <div className="text-center mb-12 flex justify-center gap-4">
            <Button size="lg" onClick={openAddProjectModal}>
              <Plus className="mr-2 h-5 w-5" /> Add New Project
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" /> Return to Main Page
            </Button>
          </div>
        )}

        {isAdmin && <ApplicationsTable applications={applications} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin={isAdmin}
              onEdit={openEditProjectModal}
              onDelete={openDeleteProjectModal}
            />
          ))}
        </div>

        <InterestForm 
          projects={projects}
          onSubmit={handleAddApplication}
          onGetAISuggestions={handleGetAISuggestions}
        />

        <Footer />
      </div>

      {/* Modals */}
      <AdminLoginModal isOpen={isLoginModalOpen} onOpenChange={setLoginModalOpen} onLogin={handleLogin} />
      <ProjectModal isOpen={isProjectModalOpen} onOpenChange={setProjectModalOpen} onSave={handleSaveProject} projectToEdit={projectToEdit} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={confirmDeleteProject} />
      <SubmissionConfirmModal isOpen={isSubmissionModalOpen} onOpenChange={setSubmissionModalOpen} />
      <AiSuggestionModal isOpen={isAiSuggestModalOpen} onOpenChange={setAiSuggestModalOpen} {...aiSuggestionProfile} />
    </>
  );
};

export default AIConnectClientPage;
