/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { GModelIndex } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { Category, CategoryEdge, Task, TaskList, Transition } from './tasklist-model';

@injectable()
export class TaskListModelIndex extends GModelIndex {
    protected idToTaskListElements = new Map<string, Task | Category | Transition | CategoryEdge>();

    indexTaskList(taskList: TaskList): void {
        this.idToTaskListElements.clear();
        for (const element of [...taskList.tasks, ...taskList.categories, ...taskList.transitions, ...taskList.categoryEdges]) {
            this.idToTaskListElements.set(element.id, element);
        }
    }

    findTask(id: string): Task | undefined {
        const element = this.findElementById(id);
        return Task.is(element) ? element : undefined;
    }

    findCategory(id: string): Category | undefined {
        const element = this.findElementById(id);
        return Category.is(element) ? element : undefined;
    }

    findTransition(id: string): Transition | undefined {
        const element = this.findElementById(id);
        return Transition.is(element) ? element : undefined;
    }

    findCategoryEdge(id: string): CategoryEdge | undefined {
        const element = this.findElementById(id);
        return CategoryEdge.is?.(element) ? element : undefined;
    }

    findElementById(id: string): Task | Category | Transition | CategoryEdge | undefined {
        return this.idToTaskListElements.get(id);
    }
}
