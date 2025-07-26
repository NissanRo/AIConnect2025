'use client';

import React from 'react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import type { Project, Application } from '@/lib/types';


const applicationSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  location: z.string().min(2, 'Location is required.'),
  specialization: z.string().min(2, 'Specialization is required.'),
  gradYear: z.string().regex(/^\d{4}$/, 'Invalid year format.'),
  college: z.string().min(2, 'College name is required.'),
  skills: z.string().min(2, 'Please list at least one skill.'),
  contact: z.string().min(10, 'A valid contact number is required.'),
  email: z.string().email('Please enter a valid email address.'),
  workType: z.enum(['Team', 'Individual'], { required_error: 'Please select a work type.' }),
  projectId: z.string({ required_error: 'Please select a project.' }),
});


type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface InterestFormProps {
    projects: Project[];
    onFormSubmit: (application: Omit<Application, 'id'>) => void;
}

const InterestForm: FC<InterestFormProps> = ({ projects, onFormSubmit }) => {
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      location: '',
      specialization: '',
      gradYear: '',
      college: '',
      skills: '',
      contact: '',
      email: '',
    },
  });

  const { handleSubmit, control, reset, formState: { isSubmitting } } = form;

  const processSubmit = (values: ApplicationFormValues) => {
    const projectInterest = projects.find(p => p.id === values.projectId)?.title || '';
    onFormSubmit({ ...values, projectInterest });
    reset();
  };
  
  return (
    <section id="interestFormSection" className="max-w-4xl mx-auto my-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Express Your Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Your full name" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="location" render={({ field }) => ( <FormItem><FormLabel>Current Location</FormLabel><FormControl><Input {...field} placeholder="City, Country" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="specialization" render={({ field }) => ( <FormItem><FormLabel>Education Specialization</FormLabel><FormControl><Input {...field} placeholder="e.g., Computer Science" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="gradYear" render={({ field }) => ( <FormItem><FormLabel>Graduation Year</FormLabel><FormControl><Input type="number" {...field} placeholder="e.g., 2026" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="college" render={({ field }) => ( <FormItem><FormLabel>College / Institute Name</FormLabel><FormControl><Input {...field} placeholder="Your college or institute" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="skills" render={({ field }) => ( <FormItem><FormLabel>Skills</FormLabel><FormControl><Input {...field} placeholder="e.g., Python, React, ML" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="contact" render={({ field }) => ( <FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} placeholder="Your phone number" /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email ID</FormLabel><FormControl><Input type="email" {...field} placeholder="Your email address" /></FormControl><FormMessage /></FormItem> )} />
                </div>
                
                <FormField control={control} name="workType" render={({ field }) => ( 
                    <FormItem className="space-y-3"><FormLabel>How will you be working?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Team" /></FormControl><FormLabel className="font-normal">Team</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Individual" /></FormControl><FormLabel className="font-normal">Individual</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem> 
                )} />

                <FormField
                  control={control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project of Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.code}: {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit Interest'}
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default InterestForm;
