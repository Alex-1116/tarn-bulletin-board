from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.task import Task, TaskCreate, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter()

@router.get("/", response_model=List[Task])
async def read_tasks(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve tasks.
    """
    tasks = await TaskService.get_multi(db, skip=skip, limit=limit)
    return tasks

@router.post("/", response_model=Task, status_code=201)
async def create_task(
    *,
    db: AsyncSession = Depends(get_db),
    task_in: TaskCreate,
) -> Any:
    """
    Create new task.
    """
    task = await TaskService.create(db=db, obj_in=task_in)
    return task

@router.put("/{id}", response_model=Task)
async def update_task(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    task_in: TaskUpdate,
) -> Any:
    """
    Update a task.
    """
    task = await TaskService.get(db=db, id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task = await TaskService.update(db=db, db_obj=task, obj_in=task_in)
    return task

@router.get("/{id}", response_model=Task)
async def read_task(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    Get task by ID.
    """
    task = await TaskService.get(db=db, id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/{id}", response_model=Task)
async def delete_task(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
) -> Any:
    """
    Delete a task.
    """
    task = await TaskService.get(db=db, id=id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task = await TaskService.delete(db=db, id=id)
    return task
