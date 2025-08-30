/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { AnyObject, hasArrayProp, hasObjectProp, hasStringProp } from '@eclipse-glsp/server';

/**
 * The source model for `tasklist` GLSP diagrams.
 */
export interface TaskList {
    id: string;
    tasks: Task[];
    categories: Category[];
    transitions: Transition[];
    categoryEdges: CategoryEdge[];
}

export namespace TaskList {
    export function is(object: any): object is TaskList {
        return (
            AnyObject.is(object) &&
            hasStringProp(object, 'id') &&
            hasArrayProp(object, 'tasks') &&
            hasArrayProp(object, 'categories') &&
            hasArrayProp(object, 'transitions') &&
            hasArrayProp(object, 'categoryEdges')
        );
    }
}

export interface Task {
    id: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export namespace Task {
    export function is(object: any): object is Task {
        return AnyObject.is(object) && hasStringProp(object, 'id') && hasStringProp(object, 'name') && hasObjectProp(object, 'position');
    }
}

export interface Category {
    id: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export namespace Category {
    export function is(object: any): object is Category {
        return AnyObject.is(object) && hasStringProp(object, 'id') && hasStringProp(object, 'name') && hasObjectProp(object, 'position');
    }
}

export interface Transition {
    id: string;
    sourceTaskId: string;
    targetTaskId: string;
    label?: string;
}

export namespace Transition {
    export function is(object: any): object is Transition {
        return (
            AnyObject.is(object) &&
            hasStringProp(object, 'id') &&
            hasStringProp(object, 'sourceTaskId') &&
            hasStringProp(object, 'targetTaskId')
        );
    }
}

export interface CategoryEdge {
    id: string;
    sourceTaskId: string;
    targetTaskId: string;
    label?: string;
}

export namespace CategoryEdge {
    export function is(object: any): object is CategoryEdge {
        return (
            AnyObject.is(object) &&
            hasStringProp(object, 'id') &&
            hasStringProp(object, 'sourceTaskId') &&
            hasStringProp(object, 'targetTaskId')
        );
    }
}
