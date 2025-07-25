'use client';

import React from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  objective: z.string().min(10, 'Objective is required'),
  deliverables: z.string().min(10, 'Deliverables are required'),
  tools: z.string().min(2, 'Tools are required'),
  longTermScope: z.string().min(10, 'Long-term scope is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().min(2, 'Image hint is required').max(20, 'Hint too long'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (projectData: Omit<Project, 'id' | 'code' | 'order'>, id?: string) => void;
  projectToEdit: Project | null;
}

export const ProjectModal: FC<ProjectModalProps> = ({ isOpen, onOpenChange, onSave, projectToEdit }) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      objective: '',
      deliverables: '',
      tools: '',
      longTermScope: '',
      imageUrl: '',
      imageHint: '',
    }
  });

  const { reset, handleSubmit } = form;

  React.useEffect(() => {
    if (isOpen) {
        if (projectToEdit) {
          reset({
            ...projectToEdit,
            deliverables: projectToEdit.deliverables.join('\\n'),
            tools: projectToEdit.tools.join(', '),
          });
        } else {
          reset({
            title: '',
            objective: '',
            deliverables: '',
            tools: '',
            longTermScope: '',
            imageUrl: 'https://placehold.co/600x400.png',
            imageHint: '',
          });
        }
    }
  }, [projectToEdit, reset, isOpen]);

  const handleSaveSubmit = (values: ProjectFormValues) => {
    const projectData = {
      ...values,
      deliverables: values.deliverables.split('\\n').map(s => s.trim()).filter(Boolean),
      tools: values.tools.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(projectData, projectToEdit?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{projectToEdit ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleSaveSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="objective" render={({ field }) => ( <FormItem><FormLabel>Objective</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="deliverables" render={({ field }) => ( <FormItem><FormLabel>Deliverables (one per line)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="tools" render={({ field }) => ( <FormItem><FormLabel>Preferred Tools (comma-separated)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="longTermScope" render={({ field }) => ( <FormItem><FormLabel>Long-Term Scope</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="imageHint" render={({ field }) => ( <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input placeholder="e.g. 'ai chatbot'" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
