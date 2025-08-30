/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { GEdge, GGraph, GLabel, GModelFactory, GNode } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Category, CategoryEdge, Task, Transition } from './tasklist-model';
import { TaskListModelState } from './tasklist-model-state';

@injectable()
export class TaskListGModelFactory implements GModelFactory {
    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    createModel(): void {
        const taskList = this.modelState.sourceModel;
        this.modelState.index.indexTaskList(taskList);

        const categoryNodes = taskList.categories.map(c => this.createCategoryNode(c));
        const taskNodes = taskList.tasks.map(t => this.createTaskNode(t));
        const transitionEdges = taskList.transitions.map(t => this.createTransitionEdge(t));
        const categoryEdges = taskList.categoryEdges.map(ca => this.createCategoryEdge(ca));

        const newRoot = GGraph.builder()
            .id(taskList.id)
            .addChildren([...categoryNodes, ...taskNodes, ...transitionEdges, ...categoryEdges])
            .build();

        this.modelState.updateRoot(newRoot);
    }

    protected createCategoryNode(category: Category): GNode {
        const builder = GNode.builder()
            .id(category.id)
            .addCssClass('category-node')
            .add(GLabel.builder().text(category.name).id(`${category.id}_label`).build())
            .layout('hbox')
            .addLayoutOption('paddingLeft', 5)
            .position(category.position);

        if (category.size) {
            builder.addLayoutOptions({
                prefWidth: category.size.width,
                prefHeight: category.size.height
            });
        }

        return builder.build();
    }

    protected createTaskNode(task: Task): GNode {
        const builder = GNode.builder()
            .id(task.id)
            .addCssClass('tasklist-node')
            .add(GLabel.builder().text(task.name).id(`${task.id}_label`).build())
            .layout('hbox')
            .addLayoutOption('paddingLeft', 5)
            .position(task.position);

        if (task.size) {
            builder.addLayoutOptions({
                prefWidth: task.size.width,
                prefHeight: task.size.height
            });
        }

        return builder.build();
    }

    protected createTransitionEdge(transition: Transition): GEdge {
        const builder = GEdge.builder()
            .id(transition.id)
            .addCssClass('tasklist-transition')
            .sourceId(transition.sourceTaskId)
            .targetId(transition.targetTaskId);

        return builder.build();
    }

    protected createCategoryEdge(categoryEdge: CategoryEdge): GEdge {
        const builder = GEdge.builder()
            .id(categoryEdge.id)
            .addCssClass('category-edge')
            .sourceId(categoryEdge.sourceTaskId)
            .targetId(categoryEdge.targetTaskId);

        return builder.build();
    }
}
