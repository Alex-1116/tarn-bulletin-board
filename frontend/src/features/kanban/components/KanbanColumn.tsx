import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onDeleteTask: (id: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onDeleteTask,
}) => {
  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'Column', status: id },
  });

  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-muted/50 rounded-lg p-3 min-h-[500px] max-h-[calc(100vh-184px)] overflow-y-auto",
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
