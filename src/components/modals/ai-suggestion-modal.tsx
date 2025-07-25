'use client';

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getProjectSuggestions } from '@/app/actions';
import type { ProjectSuggestionOutput } from '@/ai/flows/project-suggestion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, ServerCrash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface AiSuggestionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  specialization: string;
  skills: string;
}

export const AiSuggestionModal: FC<AiSuggestionModalProps> = ({ isOpen, onOpenChange, specialization, skills }) => {
  const [suggestions, setSuggestions] = useState<ProjectSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && specialization && skills) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        const result = await getProjectSuggestions({ specialization, skills });
        if ('error' in result) {
          setError(result.error);
        } else {
          setSuggestions(result);
        }
        setIsLoading(false);
      };
      fetchSuggestions();
    }
  }, [isOpen, specialization, skills]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Project Suggestions</DialogTitle>
          <DialogDescription>
            Based on your profile, here are some projects you might be a great fit for.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}
          {error && (
             <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {suggestions?.suggestedProjects && suggestions.suggestedProjects.length > 0 && (
            <div className="space-y-4">
              {suggestions.suggestedProjects.map(proj => (
                <Card key={proj.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Lightbulb className="text-primary h-5 w-5" />
                            Project: {proj.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{proj.reason}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          )}
          {suggestions?.suggestedProjects?.length === 0 && (
            <p className="text-center text-muted-foreground">No specific suggestions found. Feel free to browse all projects!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
