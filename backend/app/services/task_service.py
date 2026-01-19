from typing import List, Optional

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    @staticmethod
    async def get_multi(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Task]:
        result = await db.execute(select(Task).offset(skip).limit(limit).order_by(Task.position))
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, obj_in: TaskCreate) -> Task:
        db_obj = Task(
            title=obj_in.title,
            description=obj_in.description,
            status=obj_in.status,
            position=obj_in.position,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    @staticmethod
    async def get(db: AsyncSession, id: int) -> Optional[Task]:
        result = await db.execute(select(Task).where(Task.id == id))
        return result.scalars().first()

    @staticmethod
    async def update(db: AsyncSession, *, db_obj: Task, obj_in: TaskUpdate) -> Task:
        update_data = obj_in.model_dump(exclude_unset=True)
        if not update_data:
            return db_obj
            
        stmt = (
            update(Task)
            .where(Task.id == db_obj.id)
            .values(**update_data)
            .execution_options(synchronize_session="fetch")
        )
        await db.execute(stmt)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    @staticmethod
    async def delete(db: AsyncSession, id: int) -> Optional[Task]:
        db_obj = await TaskService.get(db, id)
        if db_obj:
            await db.delete(db_obj)
            await db.commit()
        return db_obj
