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
import { EdgeCreationChecker, GModelElement } from '@eclipse-glsp/server/';
import { injectable } from 'inversify';
import { TaskNode } from './graph-extension';
import { ModelTypes } from './util/model-types';

@injectable()
export class WorkflowEdgeCreationChecker implements EdgeCreationChecker {
    isValidSource(edgeType: string, sourceElement: GModelElement): boolean {
        if (edgeType !== ModelTypes.WEIGHTED_EDGE && edgeType !== ModelTypes.WEIGHTED_EDGE_CP) {
            return false;
        }

        // Allow decision nodes and their Cp variants as sources
        return sourceElement.type === ModelTypes.DECISION_NODE || sourceElement.type === ModelTypes.DECISION_NODE_CP;
    }

    isValidTarget(edgeType: string, sourceElement: GModelElement, targetElement: GModelElement): boolean {
        if (edgeType !== ModelTypes.WEIGHTED_EDGE && edgeType !== ModelTypes.WEIGHTED_EDGE_CP) {
            return false;
        }

        // Allow normal TaskNodes, forks/joins, and their Cp variants as targets
        return (
            targetElement instanceof TaskNode ||
            targetElement.type === ModelTypes.FORK_NODE ||
            targetElement.type === ModelTypes.JOIN_NODE ||
            targetElement.type === ModelTypes.FORK_CP_NODE ||
            targetElement.type === ModelTypes.JOIN_CP_NODE
        );
    }
}
