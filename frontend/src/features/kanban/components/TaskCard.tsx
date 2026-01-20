import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Task, TaskStatus } from '@/types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusConfig: Record<TaskStatus, { title: string; className: string }> = {
  todo: { title: '待办', className: 'bg-slate-400' },
  doing: { title: '进行中', className: 'bg-blue-500' },
  done: { title: '已完成', className: 'bg-green-500' },
};

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
  const status = statusConfig[task.status];

  return (
    <Card className={`cursor-grab active:cursor-grabbing ${className}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-sm font-medium leading-none flex items-center gap-2">
          <div 
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${status.className}`}
            title={status.title}
          />
          <span className="truncate">{task.title}</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 ml-2"
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
