import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Task } from '@/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none mb-3">
      <TaskCardContent task={task} onDelete={onDelete} />
    </div>
  );
};

export const TaskCardContent: React.FC<TaskCardProps & { className?: string }> = ({ task, onDelete, className }) => {
  return (
    <Card className={`cursor-grab active:cursor-grabbing ${className}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-sm font-medium leading-none">
          {task.title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      {task.description && (
        <CardContent className="p-4 pt-0">
          <p className="text-xs text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
    </Card>
  );
};
