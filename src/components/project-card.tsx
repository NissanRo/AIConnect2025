import type { FC } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  projectNumber: number;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, projectNumber, isAdmin, onEdit, onDelete }) => {
  const getImageUrl = () => {
    if (project.imageUrl && project.imageUrl.startsWith('https://placehold.co')) {
      return `https://placehold.co/600x400/eeeeee/cccccc.png?text=Project+${projectNumber}`;
    }
    return project.imageUrl;
  }
  
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative w-full h-48">
        <Image
          src={getImageUrl()}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={project.imageHint}
        />
        {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2">
                <Button size="icon" variant="secondary" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
            </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{project.code}: {project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground"><strong className="text-foreground">Objective:</strong> {project.objective}</p>
        {project.deliverables.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Deliverables:</h4>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
              {project.deliverables.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        )}
        {project.tools.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Preferred Tools:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((t, i) => <Badge key={i} variant="secondary">{t}</Badge>)}
            </div>
          </div>
        )}
        {project.longTermScope && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Long-Term Scope:</h4>
            <p className="text-muted-foreground text-sm italic">{project.longTermScope}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
