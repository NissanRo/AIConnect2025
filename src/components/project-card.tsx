import type { FC } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  isReordering: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onMove: (projectId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, isAdmin, isReordering, onEdit, onDelete, onMove, isFirst, isLast }) => {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative w-full h-48">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={project.imageHint}
        />
        {isReordering && (
           <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button size="icon" className="h-8 w-8" onClick={() => onMove(project.id, 'up')} disabled={isFirst}>
                <ArrowUp className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8" onClick={() => onMove(project.id, 'down')} disabled={isLast}>
                <ArrowDown className="h-4 w-4" />
            </Button>
        </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.code}: {project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground"><strong className="text-foreground">Objective:</strong> {project.objective}</p>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Deliverables:</h4>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
            {project.deliverables.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Preferred Tools:</h4>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((t, i) => <Badge key={i} variant="secondary">{t}</Badge>)}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Long-Term Scope:</h4>
          <p className="text-muted-foreground text-sm italic">{project.longTermScope}</p>
        </div>
      </CardContent>
      {isAdmin && !isReordering && (
        <CardFooter className="mt-auto pt-4 border-t justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(project)}><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(project)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProjectCard;
