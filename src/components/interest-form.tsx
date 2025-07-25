'use client';

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Sparkles } from 'lucide-react';
import type { Project, Application } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location is required." }),
  specialization: z.string().min(2, { message: "Specialization is required." }),
  skills: z.string().min(2, { message: "Please list some of your skills." }),
  gradYear: z.coerce.number().min(2023, "Invalid year").max(2030, "Invalid year"),
  college: z.string().min(2, { message: "College name is required." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  workType: z.enum(["Team", "Individual"], { required_error: "Please select your work preference." }),
  projectId: z.string({ required_error: "Please select a project." }),
});

type FormValues = z.infer<typeof formSchema>;

interface InterestFormProps {
  projects: Project[];
  onSubmit: (application: Application) => void;
  onGetAISuggestions: (specialization: string, skills: string) => void;
}

const InterestForm: FC<InterestFormProps> = ({ projects, onSubmit, onGetAISuggestions }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
      specialization: '',
      skills: '',
      college: '',
      contact: '',
      email: '',
    },
  });
  
  const { watch } = form;
  const specialization = watch('specialization');
  const skills = watch('skills');

  function handleFormSubmit(values: FormValues) {
    const selectedProject = projects.find(p => p.id === parseInt(values.projectId));
    if (!selectedProject) return;

    const application: Application = {
      ...values,
      gradYear: values.gradYear.toString(),
      projectId: selectedProject.id,
      projectInterest: `Project ${selectedProject.id}: ${selectedProject.title}`,
    };
    onSubmit(application);
    form.reset();
  }
  
  const handleAISuggestClick = () => {
    if (specialization && skills) {
      onGetAISuggestions(specialization, skills);
    } else {
      form.trigger(['specialization', 'skills']);
    }
  };

  return (
    <section id="interestFormSection" className="max-w-4xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Express Your Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="location" render={({ field }) => ( <FormItem><FormLabel>Current Location</FormLabel><FormControl><Input placeholder="City, Country" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="specialization" render={({ field }) => ( <FormItem><FormLabel>Education Specialization</FormLabel><FormControl><Input placeholder="e.g., Computer Science, Marketing" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="gradYear" render={({ field }) => ( <FormItem><FormLabel>Graduation Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2025" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="md:col-span-2">
                  <FormField control={form.control} name="college" render={({ field }) => ( <FormItem><FormLabel>College / Institute Name</FormLabel><FormControl><Input placeholder="Your college or institute" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                 <div className="md:col-span-2">
                  <FormField control={form.control} name="skills" render={({ field }) => ( <FormItem><FormLabel>Skills</FormLabel><FormControl><Textarea placeholder="e.g., Python, React, Data Analysis, Machine Learning" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <FormField control={form.control} name="contact" render={({ field }) => ( <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input type="tel" placeholder="Your phone number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" placeholder="Your email address" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="md:col-span-2">
                  <FormField control={form.control} name="workType" render={({ field }) => ( <FormItem><FormLabel>How will you be working?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-6 pt-2"><FormItem className="flex items-center space-x-2"><RadioGroupItem value="Team" id="workType-team" /><FormLabel htmlFor="workType-team" className="font-normal">Team</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><RadioGroupItem value="Individual" id="workType-individual" /><FormLabel htmlFor="workType-individual" className="font-normal">Individual</FormLabel></FormItem></RadioGroup></FormControl><FormMessage /></FormItem> )} />
                </div>
                <div className="md:col-span-2">
                   <FormField control={form.control} name="projectId" render={({ field }) => ( <FormItem> <FormLabel>Project of Interest</FormLabel> <div className="flex gap-2 items-start"> <div className="flex-grow"> <FormControl> <Select onValueChange={field.onChange} defaultValue={field.value}> <SelectTrigger> <SelectValue placeholder="Select a Project" /> </SelectTrigger> <SelectContent> {projects.map(project => ( <SelectItem key={project.id} value={project.id.toString()}> Project {project.id}: {project.title} </SelectItem> ))} </SelectContent> </Select> </FormControl> </div> <Button type="button" variant="outline" onClick={handleAISuggestClick} aria-label="Get AI Suggestions"> <Sparkles className="h-4 w-4" /> </Button> </div> <FormMessage /> </FormItem> )} />
                </div>
              </div>
              <div className="text-center mt-6">
                <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Submit Interest <Send className="ml-2 h-4 w-4"/>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default InterestForm;
