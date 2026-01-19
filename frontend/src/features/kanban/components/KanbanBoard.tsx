import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { TaskCardContent } from './TaskCard';
import type { Task, TaskStatus } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateTaskDialog } from './CreateTaskDialog';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard: React.FC = () => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Queries
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  // Mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => taskApi.update(id, data),
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // DnD Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id; // Could be task ID (number) or column ID (string)

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Determine new status and position
    let newStatus: TaskStatus = activeTask.status;
    // let newPosition = activeTask.position;

    // Check if dropped on a column
    if (['todo', 'doing', 'done'].includes(overId as string)) {
        newStatus = overId as TaskStatus;
        // Simple logic: append to end if dropped on column
        // Ideally calculate based on index
    } else {
        // Dropped on another task
        const overTask = tasks.find(t => t.id === overId);
        if (overTask) {
            newStatus = overTask.status;
            // Logic to insert before/after would go here
            // For simplicity in this MVP, we just update status if changed
        }
    }

    if (activeTask.status !== newStatus) {
       // Optimistic update
       const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
       queryClient.setQueryData<Task[]>(['tasks'], (old) => {
          if (!old) return [];
          return old.map((task) =>
            task.id === activeId ? { ...task, status: newStatus } : task
          );
       });

       updateTaskMutation.mutate({
           id: activeId,
           data: { status: newStatus }
       }, {
           onError: () => {
             // Revert on error
             if (previousTasks) {
               queryClient.setQueryData(['tasks'], previousTasks);
             }
           }
       });
    }

    setActiveTask(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="h-full overflow-x-auto pb-4 flex items-start">
          <div className="flex gap-6 px-4 mx-auto">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={tasks.filter((t) => t.status === col.id).sort((a,b) => a.position - b.position)}
                onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardContent task={activeTask} onDelete={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};
