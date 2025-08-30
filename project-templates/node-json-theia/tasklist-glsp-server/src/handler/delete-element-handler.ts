/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import {
    Command,
    DeleteElementOperation,
    GEdge,
    GNode,
    JsonOperationHandler,
    MaybePromise,
    remove,
    toTypeGuard
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { Category, CategoryEdge, Task, Transition } from '../model/tasklist-model';
import { TaskListModelState } from '../model/tasklist-model-state';

@injectable()
export class DeleteElementHandler extends JsonOperationHandler {
    readonly operationType = DeleteElementOperation.KIND;

    @inject(TaskListModelState)
    protected override modelState: TaskListModelState;

    override createCommand(operation: DeleteElementOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            operation.elementIds.forEach(elementId => this.delete(elementId));
        });
    }

    protected delete(elementId: string): void {
        const index = this.modelState.index;
        const gModelElement = this.getGModelElementToDelete(elementId);
        const gModelElementId = gModelElement?.id ?? elementId;
        const gEdgeIds = this.getIncomingAndOutgoingEdgeIds(gModelElement);

        [...gEdgeIds, gModelElementId].map(id => index.findElementById(id)).forEach(modelElement => this.deleteModelElement(modelElement));
    }

    private getGModelElementToDelete(elementId: string): GNode | GEdge | undefined {
        const index = this.modelState.index;
        const element = index.get(elementId);
        if (element instanceof GNode || element instanceof GEdge) {
            return element;
        }
        return index.findParentElement(elementId, toTypeGuard(GNode)) ?? index.findParentElement(elementId, toTypeGuard(GEdge));
    }

    protected getIncomingAndOutgoingEdgeIds(node: GNode | GEdge | undefined): string[] {
        return this.getIncomingAndOutgoingEdges(node).map(edge => edge.id);
    }

    protected getIncomingAndOutgoingEdges(node: GNode | GEdge | undefined): GEdge[] {
        if (node instanceof GNode) {
            return [...this.modelState.index.getIncomingEdges(node), ...this.modelState.index.getOutgoingEdges(node)];
        }
        return [];
    }

    private deleteModelElement(modelElement: Category | Task | Transition | CategoryEdge | undefined): void {
        if (!modelElement) {
            return;
        }

        if (Category.is(modelElement)) {
            remove(this.modelState.sourceModel.categories, modelElement);
        }
        if (Task.is(modelElement)) {
            remove(this.modelState.sourceModel.tasks, modelElement);
        }
        if (Transition.is(modelElement)) {
            remove(this.modelState.sourceModel.transitions, modelElement);
        }
        if (CategoryEdge.is?.(modelElement)) {
            remove(this.modelState.sourceModel.categoryEdges, modelElement);
        }
    }
}
