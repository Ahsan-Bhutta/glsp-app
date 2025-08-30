/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
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
/* eslint-disable @typescript-eslint/padding-line-between-statements */
export namespace ModelTypes {
    export const LABEL_HEADING = 'label:heading';
    export const LABEL_TEXT = 'label:text';
    export const COMP_HEADER = 'comp:header';
    export const LABEL_ICON = 'label:icon';
    export const WEIGHTED_EDGE = 'edge:weighted';
    export const ICON = 'icon';
    export const ACTIVITY_NODE = 'activityNode';
    export const DECISION_NODE = `${ACTIVITY_NODE}:decision`;
    export const MERGE_NODE = `${ACTIVITY_NODE}:merge`;
    export const FORK_NODE = `${ACTIVITY_NODE}:fork`;
    export const JOIN_NODE = `${ACTIVITY_NODE}:join`;
    export const TASK = 'task';
    export const MANUAL_TASK = `${TASK}:manual`;
    export const AUTOMATED_TASK = `${TASK}:automated`;
    export const CATEGORY = 'category';
    export const STRUCTURE = 'struct';

    // My Work for eclipse-glsp
    export const AUTOMATED_TASK_CP = `${TASK}:automatedCp`;
    export const MANUAL_TASK_CP = `${TASK}:manualCp`;
    export const CATEGORY_CP = 'categoryCp';
    export const FORK_CP_NODE = `${ACTIVITY_NODE}:forkCp`;
    export const JOIN_CP_NODE = `${ACTIVITY_NODE}:joinCp`;
    export const DECISION_NODE_CP = `${ACTIVITY_NODE}:decisionCp`;
    export const MERGE_NODE_CP = `${ACTIVITY_NODE}:mergeCp`;
    export const HYBRID_TASK = `${TASK}:hybrid`;
    export const AUTONOMOUS_TASK = `${TASK}:autonomous`;
    export const COGNITIVE_TASK = `${TASK}:cognitive`;

    // --- New Cp Edges ---
    export const EDGE_CP = 'edge:cp';
    export const WEIGHTED_EDGE_CP = 'edge:weightedCp';

    export function toNodeType(type: string): string {
        switch (type) {
            case DECISION_NODE:
                return 'decisionNode';
            case MERGE_NODE:
                return 'mergeNode';
            case FORK_NODE:
                return 'forkNode';
            case JOIN_NODE:
                return 'joinNode';
            case AUTOMATED_TASK:
                return 'automated';
            case MANUAL_TASK:
                return 'manual';
            case CATEGORY:
                return 'category';

            // My Work for eclipse-glsp
            case AUTOMATED_TASK_CP:
                return 'automatedCp';
            case FORK_CP_NODE:
                return 'forkCpNode';
            case JOIN_CP_NODE:
                return 'joinCpNode';
            case DECISION_NODE_CP:
                return 'decisionCp';
            case MERGE_NODE_CP:
                return 'mergeCp';
            case MANUAL_TASK_CP:
                return 'manualCp';
            case CATEGORY_CP:
                return 'categoryCp';
            case HYBRID_TASK:
                return 'hybrid';
            case AUTONOMOUS_TASK:
                return 'autonomous';
            case COGNITIVE_TASK:
                return 'cognitive';
            default:
                return 'unknown';
        }
    }
}
