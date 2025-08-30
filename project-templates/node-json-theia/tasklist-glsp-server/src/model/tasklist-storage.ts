/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { AbstractJsonModelStorage, MaybePromise, RequestModelAction, SaveModelAction } from '@eclipse-glsp/server/node';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { TaskList } from './tasklist-model';
import { TaskListModelState } from './tasklist-model-state';

@injectable()
export class TaskListStorage extends AbstractJsonModelStorage {
    @inject(TaskListModelState)
    protected override modelState: TaskListModelState;

    loadSourceModel(action: RequestModelAction): MaybePromise<void> {
        const sourceUri = this.getSourceUri(action);
        console.log('📥 Loading model from:', sourceUri);
        const taskList = this.loadFromFile(sourceUri, TaskList.is);
        this.modelState.updateSourceModel(taskList);
    }

    saveSourceModel(action: SaveModelAction): MaybePromise<void> {
        const sourceUri = this.getFileUri(action);
        console.log('💾 Saving model to:', sourceUri);
        this.writeFile(sourceUri, this.modelState.sourceModel);
    }

    protected override createModelForEmptyFile(path: string): TaskList {
        console.log('🆕 Creating default empty tasklist model for path:', path);
        return {
            id: uuid.v4(),
            tasks: [],
            categories: [],
            transitions: [],
            categoryEdges: []
        };
    }
}

console.log('✅ TaskListStorage initialized successfully!');
