/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { GEdge, GEdgeBuilder, GModelCreateEdgeOperationHandler, GModelElement } from '@eclipse-glsp/server';
import { ModelTypes } from '../util/model-types';

export class CreateEdgeCpHandler extends GModelCreateEdgeOperationHandler {
    label = 'Edge Cp';
    elementTypeIds = [ModelTypes.EDGE_CP];

    createEdge(source: GModelElement, target: GModelElement): GEdge | undefined {
        return new GEdgeBuilder(GEdge).sourceId(source.id).targetId(target.id).addCssClass('edge').build();
    }
}
