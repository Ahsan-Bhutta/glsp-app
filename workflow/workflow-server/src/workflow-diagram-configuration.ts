/********************************************************************************
 * Copyright (c) 2023-2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { DefaultTypes, EdgeTypeHint, ShapeTypeHint } from '@eclipse-glsp/protocol';
import {
    DiagramConfiguration,
    GCompartment,
    GEdge,
    GLabel,
    GModelElementConstructor,
    ServerLayoutKind,
    getDefaultMapping
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { ActivityNode, Category, CategoryCp, TaskNode } from './graph-extension';
import { ModelTypes as types } from './util/model-types';

@injectable()
export class WorkflowDiagramConfiguration implements DiagramConfiguration {
    get typeMapping(): Map<string, GModelElementConstructor> {
        const mapping = getDefaultMapping();
        mapping.set(types.LABEL_HEADING, GLabel);
        mapping.set(types.LABEL_TEXT, GLabel);
        mapping.set(types.COMP_HEADER, GCompartment);
        mapping.set(types.LABEL_ICON, GLabel);
        mapping.set(types.WEIGHTED_EDGE, GEdge);
        mapping.set(types.ICON, GCompartment);
        mapping.set(types.ACTIVITY_NODE, ActivityNode);
        mapping.set(types.TASK, TaskNode);
        mapping.set(types.CATEGORY, Category);
        mapping.set(types.STRUCTURE, GCompartment);

        // My Work for eclipse-glsp
        mapping.set(types.CATEGORY_CP, CategoryCp);
        mapping.set(types.DECISION_NODE_CP, ActivityNode);
        mapping.set(types.MERGE_NODE_CP, ActivityNode);

        // ✅ New Edge Cp + Weighted Edge Cp
        mapping.set(types.EDGE_CP, GEdge);
        mapping.set(types.WEIGHTED_EDGE_CP, GEdge);

        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            createDefaultShapeTypeHint(types.MANUAL_TASK),
            createDefaultShapeTypeHint(types.AUTOMATED_TASK),
            createDefaultShapeTypeHint({ elementTypeId: types.FORK_NODE, resizable: false }),
            createDefaultShapeTypeHint({ elementTypeId: types.JOIN_NODE, resizable: false }),
            createDefaultShapeTypeHint(types.DECISION_NODE),
            createDefaultShapeTypeHint(types.MERGE_NODE),
            createDefaultShapeTypeHint({
                elementTypeId: types.CATEGORY,
                containableElementTypeIds: [types.TASK, types.ACTIVITY_NODE, types.CATEGORY]
            }),

            // My Work for eclipse-glsp
            createDefaultShapeTypeHint(types.MANUAL_TASK_CP),
            createDefaultShapeTypeHint(types.AUTOMATED_TASK_CP),
            createDefaultShapeTypeHint(types.HYBRID_TASK),
            createDefaultShapeTypeHint(types.AUTONOMOUS_TASK),
            createDefaultShapeTypeHint(types.COGNITIVE_TASK),
            createDefaultShapeTypeHint({ elementTypeId: types.FORK_CP_NODE, resizable: false }),
            createDefaultShapeTypeHint({ elementTypeId: types.JOIN_CP_NODE, resizable: false }),
            createDefaultShapeTypeHint(types.DECISION_NODE_CP),
            createDefaultShapeTypeHint(types.MERGE_NODE_CP),
            createDefaultShapeTypeHint({
                elementTypeId: types.CATEGORY_CP,
                containableElementTypeIds: [types.TASK, types.ACTIVITY_NODE, types.CATEGORY_CP]
            })
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [
            createDefaultEdgeTypeHint(DefaultTypes.EDGE),

            // ✅ Edge Cp
            createDefaultEdgeTypeHint({
                elementTypeId: types.EDGE_CP,
                sourceElementTypeIds: [
                    types.TASK,
                    types.ACTIVITY_NODE,
                    types.MANUAL_TASK,
                    types.AUTOMATED_TASK,
                    types.MANUAL_TASK_CP,
                    types.AUTOMATED_TASK_CP,
                    types.FORK_NODE,
                    types.JOIN_NODE,
                    types.FORK_CP_NODE,
                    types.JOIN_CP_NODE,
                    types.CATEGORY,
                    types.CATEGORY_CP,
                    types.MERGE_NODE,
                    types.MERGE_NODE_CP,
                    types.HYBRID_TASK,
                    types.AUTONOMOUS_TASK,
                    types.COGNITIVE_TASK
                ],
                targetElementTypeIds: [
                    types.TASK,
                    types.ACTIVITY_NODE,
                    types.MANUAL_TASK,
                    types.AUTOMATED_TASK,
                    types.MANUAL_TASK_CP,
                    types.AUTOMATED_TASK_CP,
                    types.FORK_NODE,
                    types.JOIN_NODE,
                    types.FORK_CP_NODE,
                    types.JOIN_CP_NODE,
                    types.CATEGORY,
                    types.CATEGORY_CP,
                    types.MERGE_NODE,
                    types.MERGE_NODE_CP,
                    types.HYBRID_TASK,
                    types.AUTONOMOUS_TASK,
                    types.COGNITIVE_TASK
                ]
            }),

            // Weighted Edge (normal + cp)
            createDefaultEdgeTypeHint({
                elementTypeId: types.WEIGHTED_EDGE,
                dynamic: true,
                sourceElementTypeIds: [types.DECISION_NODE, types.DECISION_NODE_CP],
                targetElementTypeIds: [
                    types.TASK,
                    types.ACTIVITY_NODE,
                    types.MANUAL_TASK,
                    types.AUTOMATED_TASK,
                    types.MANUAL_TASK_CP,
                    types.AUTOMATED_TASK_CP,
                    types.FORK_NODE,
                    types.JOIN_NODE,
                    types.FORK_CP_NODE,
                    types.JOIN_CP_NODE,
                    types.CATEGORY,
                    types.CATEGORY_CP,
                    types.MERGE_NODE,
                    types.MERGE_NODE_CP,
                    types.HYBRID_TASK,
                    types.AUTONOMOUS_TASK,
                    types.COGNITIVE_TASK
                ]
            }),
            createDefaultEdgeTypeHint({
                elementTypeId: types.WEIGHTED_EDGE_CP,
                dynamic: true,
                sourceElementTypeIds: [types.DECISION_NODE, types.DECISION_NODE_CP],
                targetElementTypeIds: [
                    types.TASK,
                    types.ACTIVITY_NODE,
                    types.MANUAL_TASK,
                    types.AUTOMATED_TASK,
                    types.MANUAL_TASK_CP,
                    types.AUTOMATED_TASK_CP,
                    types.FORK_NODE,
                    types.JOIN_NODE,
                    types.FORK_CP_NODE,
                    types.JOIN_CP_NODE,
                    types.CATEGORY,
                    types.CATEGORY_CP,
                    types.MERGE_NODE,
                    types.MERGE_NODE_CP,
                    types.HYBRID_TASK,
                    types.AUTONOMOUS_TASK,
                    types.COGNITIVE_TASK
                ]
            })
        ];
    }

    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;
}

export function createDefaultShapeTypeHint(template: { elementTypeId: string } & Partial<ShapeTypeHint>): ShapeTypeHint;
export function createDefaultShapeTypeHint(elementId: string): ShapeTypeHint;
export function createDefaultShapeTypeHint(
    elementIdOrTemplate: string | ({ elementTypeId: string } & Partial<ShapeTypeHint>)
): ShapeTypeHint {
    const template = typeof elementIdOrTemplate === 'string' ? { elementTypeId: elementIdOrTemplate } : elementIdOrTemplate;
    return { repositionable: true, deletable: true, resizable: true, reparentable: true, ...template };
}

export function createDefaultEdgeTypeHint(template: { elementTypeId: string } & Partial<EdgeTypeHint>): EdgeTypeHint;
export function createDefaultEdgeTypeHint(elementId: string): EdgeTypeHint;
export function createDefaultEdgeTypeHint(elementIdOrTemplate: string | ({ elementTypeId: string } & Partial<EdgeTypeHint>)): EdgeTypeHint {
    const template = typeof elementIdOrTemplate === 'string' ? { elementTypeId: elementIdOrTemplate } : elementIdOrTemplate;
    return {
        repositionable: true,
        deletable: true,
        routable: true,
        sourceElementTypeIds: [
            types.MANUAL_TASK,
            types.AUTOMATED_TASK,
            types.DECISION_NODE,
            types.MERGE_NODE,
            types.FORK_NODE,
            types.JOIN_NODE,
            types.CATEGORY,
            // My Work
            types.MANUAL_TASK_CP,
            types.AUTOMATED_TASK_CP,
            types.FORK_CP_NODE,
            types.JOIN_CP_NODE,
            types.CATEGORY_CP,
            types.DECISION_NODE_CP,
            types.MERGE_NODE_CP,
            types.HYBRID_TASK,
            types.AUTONOMOUS_TASK,
            types.COGNITIVE_TASK
        ],
        targetElementTypeIds: [
            types.MANUAL_TASK,
            types.AUTOMATED_TASK,
            types.DECISION_NODE,
            types.MERGE_NODE,
            types.FORK_NODE,
            types.JOIN_NODE,
            types.CATEGORY,
            // My Work
            types.MANUAL_TASK_CP,
            types.AUTOMATED_TASK_CP,
            types.FORK_CP_NODE,
            types.JOIN_CP_NODE,
            types.CATEGORY_CP,
            types.DECISION_NODE_CP,
            types.MERGE_NODE_CP,
            types.HYBRID_TASK,
            types.AUTONOMOUS_TASK,
            types.COGNITIVE_TASK
        ],
        ...template
    };
}
