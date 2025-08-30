/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import {
    DefaultTypes,
    DiagramConfiguration,
    EdgeTypeHint,
    getDefaultMapping,
    GModelElement,
    GModelElementConstructor,
    ServerLayoutKind,
    ShapeTypeHint
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class TaskListDiagramConfiguration implements DiagramConfiguration {
    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;

    get typeMapping(): Map<string, GModelElementConstructor<GModelElement>> {
        return getDefaultMapping();
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            {
                elementTypeId: 'tasklist-node',
                deletable: true,
                reparentable: false,
                repositionable: true,
                resizable: true
            },
            {
                elementTypeId: 'category-node',
                deletable: true,
                reparentable: false,
                repositionable: true,
                resizable: true
            }
        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [
            {
                elementTypeId: DefaultTypes.EDGE,
                deletable: true,
                repositionable: true,
                routable: true,
                sourceElementTypeIds: ['tasklist-node', 'category-node'],
                targetElementTypeIds: ['tasklist-node', 'category-node']
            },
            {
                elementTypeId: DefaultTypes.EDGE,
                deletable: true,
                repositionable: true,
                routable: true,
                dynamic: true,
                sourceElementTypeIds: ['tasklist-node', 'category-node'],
                targetElementTypeIds: ['tasklist-node', 'category-node']
            }
        ];
    }
}
