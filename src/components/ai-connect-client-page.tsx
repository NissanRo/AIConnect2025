'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useToast } from "@/hooks/use-toast"
import type { Project, Application } from '@/lib/types';
import { initialProjects } from '@/data/initial-projects';
import Header from '@/components/header';
import AboutSection from '@/components/about-section';
import ProjectCard from '@/components/project-card';
import InterestForm from '@/components/interest-form';
import ApplicationsTable from '@/components/admin/applications-table';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { AdminLoginModal } from '@/components/modals/admin-login-modal';
import { ProjectModal } from '@/components/modals/project-modal';
import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { SubmissionConfirmModal } from '@/components/modals/submission-confirm-modal';

const AIConnectClientPage: FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

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
      toast({ title: "Logged Out", description: "You have successfully logged out." });
  };
  
  const handleOpenProjectModal = (project: Project | null) => {
    setProjectToEdit(project);
    setProjectModalOpen(true);
  }

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'code' | 'order'>, id?: string) => {
    if (id) {
        setProjects(projects.map(p => p.id === id ? { ...p, ...projectData } : p));
        toast({ title: 'Project Updated', description: 'The project details have been saved.' });
    } else {
        const nextPlaceholderIndex = projects.findIndex(p => p.title.startsWith('Placeholder'));
        if(nextPlaceholderIndex !== -1) {
            const placeholderProject = projects[nextPlaceholderIndex];
            const newProject = {
                ...placeholderProject,
                ...projectData,
            }
            setProjects(projects.map(p => p.id === placeholderProject.id ? newProject : p));
            toast({ title: 'Project Added', description: 'A new project has been created.' });
        } else {
            toast({ title: 'Error', description: 'No available placeholder slots to add a new project.', variant: 'destructive' });
        }
    }
    setProjectModalOpen(false);
  }

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
    setDeleteModalOpen(true);
  }

  const confirmDelete = () => {
    if(projectToDelete) {
        const project = projects.find(p => p.id === projectToDelete);
        if (project) {
            const placeholderProject = {
                ...project,
                title: `Placeholder Project ${project.order}`,
                objective: '',
                deliverables: [],
                tools: [],
                longTermScope: '',
                imageUrl: 'https://placehold.co/600x400.png',
                imageHint: 'placeholder empty',
            };
            setProjects(projects.map(p => p.id === projectToDelete ? placeholderProject : p));
            toast({ title: 'Project Deleted', description: 'The project has been reset to a placeholder.' });
        }
    }
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };
  
  const handleFormSubmit = async (application: Omit<Application, 'id'>) => {
    const newId = `app-${Date.now()}`;
    const newApplication = { ...application, id: newId };
    setApplications(prev => [...prev, newApplication]);
    
    // Prepare data for Formspree
    const formData = new FormData();
    Object.entries(newApplication).forEach(([key, value]) => {
      if(key === 'projectInterests') {
        formData.append('Projects of Interest', value.join(', '));
      } else if(key !== 'projectIds' && key !== 'id') {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetch('https://formspree.io/f/mwpqorgp', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setConfirmModalOpen(true);
      } else {
        toast({ title: "Submission Error", description: "Could not submit the form. Please try again.", variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Submission Error", description: "An error occurred. Please try again.", variant: "destructive" });
    }
  };

  const visibleProjects = projects.filter(p => !p.title.startsWith('Placeholder')).sort((a,b) => a.order - b.order);

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
            <div className="max-w-7xl mx-auto my-8 p-4 bg-card border rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Admin Controls</h2>
                    <div className="flex gap-2">
                        <Button onClick={() => handleOpenProjectModal(null)}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                    </div>
                </div>
                 <ApplicationsTable applications={applications} />
            </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            {visibleProjects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    projectNumber={index + 1}
                    isAdmin={isAdmin}
                    onEdit={() => handleOpenProjectModal(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                />
            ))}
        </div>

        <InterestForm projects={visibleProjects} onFormSubmit={handleFormSubmit} />

        <Footer />
      </div>

      {/* Modals */}
      <AdminLoginModal isOpen={isLoginModalOpen} onOpenChange={setLoginModalOpen} onLogin={handleLogin} />
      <ProjectModal isOpen={isProjectModalOpen} onOpenChange={setProjectModalOpen} onSave={handleSaveProject} projectToEdit={projectToEdit} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={confirmDelete} />
      <SubmissionConfirmModal isOpen={isConfirmModalOpen} onOpenChange={setConfirmModalOpen} />
    </>
  );
};

export default AIConnectClientPage;
