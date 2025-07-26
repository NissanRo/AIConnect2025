
'use client';

import { useState, useEffect, useTransition } from 'react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, ArrowUpDown } from 'lucide-react';
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
import { getProjects, addProject, updateProject, deleteProject, getApplications, addApplication, updateProjectsOrder } from '@/app/actions';
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

  const [isReordering, setIsReordering] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    setIsReordering(false);
    toast({ title: "Logged Out", description: "You have returned to the main page." });
  };


  // Project CRUD handlers
  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'code' | 'order'>, id?: string) => {
    try {
        if (id) {
            // update project doesn't handle order or code
            const originalProject = projects.find(p => p.id === id);
            if (!originalProject) throw new Error("Project not found");
            
            const projectToUpdate = {
                title: projectData.title,
                objective: projectData.objective,
                deliverables: projectData.deliverables,
                tools: projectData.tools,
                longTermScope: projectData.longTermScope,
                imageUrl: projectData.imageUrl,
                imageHint: projectData.imageHint,
            };

            await updateProject(id, projectToUpdate);
            setProjects(await getProjects()); // Re-fetch to get the updated list
            toast({ title: "Project Updated", description: `"${projectData.title}" has been successfully updated.` });
        } else {
            const newProject = await addProject(projectData);
            setProjects(await getProjects()); // Re-fetch to get the updated list with the new project
            toast({ title: "Project Added", description: `"${newProject.title}" has been successfully added.` });
        }
    } catch (error) {
        console.error("Failed to save project:", error);
        toast({ title: "Error", description: "Failed to save project. Please try again.", variant: "destructive" });
    } finally {
        setProjectModalOpen(false);
        setProjectToEdit(null);
    }
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

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
        try {
            await deleteProject(projectToDelete.id);
            setProjects(projects.filter(p => p.id !== projectToDelete.id));
            toast({ title: "Project Deleted", description: `Project "${projectToDelete.title}" has been removed.`, variant: "destructive" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
        } finally {
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        }
    }
  };

  // Reordering handler
  const handleMoveProject = (projectId: string, direction: 'up' | 'down') => {
      const currentIndex = projects.findIndex(p => p.id === projectId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= projects.length) return;

      const newProjects = [...projects];
      // Swap positions
      [newProjects[currentIndex], newProjects[newIndex]] = [newProjects[newIndex], newProjects[currentIndex]];

      const updatedOrder = newProjects.map((p, index) => ({ ...p, order: index + 1 }));
      setProjects(updatedOrder);

      // Automatically save the new order
      startTransition(async () => {
          try {
              const orderToUpdate = updatedOrder.map(({id, order}) => ({id, order}));
              await updateProjectsOrder(orderToUpdate);
              toast({ title: "Order Updated", description: "The new project order has been saved." });
          } catch(e) {
              toast({ title: "Error", description: "Failed to save the new order.", variant: "destructive" });
              // Revert optimistic update on failure
              const freshProjects = await getProjects();
              setProjects(freshProjects);
          }
      });
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

        {isAdmin && (
          <div className="text-center mb-12 flex justify-center gap-4">
            <Button size="lg" onClick={openAddProjectModal}>
              <Plus className="mr-2 h-5 w-5" /> Add New Project
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsReordering(!isReordering)} aria-pressed={isReordering}>
                <ArrowUpDown className="mr-2 h-5 w-5" /> {isReordering ? "Done Reordering" : "Reorder Projects"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" /> Return to Main Page
            </Button>
          </div>
        )}

        {isAdmin && <ApplicationsTable applications={applications} />}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {projects.length === 0 ? renderProjectSkeletons() : projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    isAdmin={isAdmin}
                    isReordering={isReordering}
                    onEdit={openEditProjectModal}
                    onDelete={openDeleteProjectModal}
                    onMove={handleMoveProject}
                    isFirst={index === 0}
                    isLast={index === projects.length - 1}
                    isMoving={isPending}
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
      <ProjectModal isOpen={isProjectModalOpen} onOpenChange={setProjectModalOpen} onSave={handleSaveProject} projectToEdit={projectToEdit} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={confirmDeleteProject} />
      <SubmissionConfirmModal isOpen={isSubmissionModalOpen} onOpenChange={setSubmissionModalOpen} />
      <AiSuggestionModal isOpen={isAiSuggestModalOpen} onOpenChange={setAiSuggestModalOpen} {...aiSuggestionProfile} />
    </>
  );
};

export default AIConnectClientPage;
