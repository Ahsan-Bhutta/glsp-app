/********************************************************************************
 * Copyright (c) 2022-2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/

import { GModelSerializer, Logger, ModelState } from '@eclipse-glsp/server';
import { AbstractJsonModelStorage, RequestModelAction, SaveModelAction } from '@eclipse-glsp/server/node';
import { inject, injectable } from 'inversify';

import * as dotenv from 'dotenv';
import neo4j, { Driver, Session } from 'neo4j-driver';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

@injectable()
export class WorkflowNeo4jStorage extends AbstractJsonModelStorage {
    @inject(Logger)
    protected logger: Logger;

    @inject(GModelSerializer)
    protected modelSerializer: GModelSerializer;

    @inject(ModelState)
    protected override modelState: ModelState;

    private driver: Driver;

    constructor() {
        super();
        this.driver = neo4j.driver(
            process.env.NEO4J_URI || 'bolt://localhost:7687',
            neo4j.auth.basic(
                process.env.NEO4J_USERNAME || 'neo4j',
                process.env.NEO4J_PASSWORD || 'password'
            ),
            { encrypted: 'ENCRYPTION_OFF' }
        );
    }

    async loadSourceModel(action: RequestModelAction): Promise<void> {
        const session: Session = this.driver.session();
        try {
            const result = await session.run(`MATCH (d:WorkflowDiagram) RETURN d.json as json LIMIT 1`);

            if (result.records.length > 0) {
                const json = JSON.parse(result.records[0].get('json'));
                const root = this.modelSerializer.createRoot(json);
                this.modelState.updateRoot(root);
                this.logger.info(`Loaded WorkflowDiagram uuid=${root.id}`);
            } else {
                const newUuid = uuidv4();
                const empty = { id: newUuid, type: 'graph', children: [] };
                const root = this.modelSerializer.createRoot(empty);
                this.modelState.updateRoot(root);
                this.logger.info(`🆕 Created new WorkflowDiagram uuid=${newUuid}`);
            }
        } finally {
            await session.close();
        }
    }

    async saveSourceModel(action: SaveModelAction): Promise<void> {
        const session: Session = this.driver.session();
        try {
            const schema = this.modelSerializer.createSchema(this.modelState.root);
            const sourceUuid = schema.id || uuidv4();
            schema.id = sourceUuid;

            const json = JSON.stringify(schema);

            if (!Array.isArray(schema.children) || schema.children.length === 0) {
                await session.run(`MATCH (d:WorkflowDiagram {uuid: $uuid})-[:HAS_NODE]->(n) DETACH DELETE n`, { uuid: sourceUuid });
                await session.run(`MATCH (d:WorkflowDiagram {uuid: $uuid})-[:HAS_EDGE]->(e) DETACH DELETE e`, { uuid: sourceUuid });
                await session.run(`MATCH (d:WorkflowDiagram {uuid: $uuid}) DETACH DELETE d`, { uuid: sourceUuid });
                this.logger.info(`🗑️ Deleted empty WorkflowDiagram uuid=${sourceUuid}`);
                return;
            }

            await session.run(
                `MERGE (d:WorkflowDiagram {uuid: $uuid})
                 SET d.json = $json`,
                { uuid: sourceUuid, json }
            );
            this.logger.info(`💾 Saved WorkflowDiagram uuid=${sourceUuid}`);

            await session.run(`MATCH (d:WorkflowDiagram {uuid: $uuid})-[:HAS_NODE]->(n) DETACH DELETE n`, { uuid: sourceUuid });
            await session.run(`MATCH (d:WorkflowDiagram {uuid: $uuid})-[:HAS_EDGE]->(e) DETACH DELETE e`, { uuid: sourceUuid });

            const NODE_TYPES = ['category', 'task:manual', 'task:automated', 'decisionnode', 'mergenode', 'forknode', 'joinnode'];

            for (const child of schema.children) {
                const type = (child.type || '').toLowerCase();

                if (type.includes('node') || NODE_TYPES.includes(type)) {
                    const nid = (child as any).id || uuidv4();

                    // Fix: name update (take latest from schema → child.name or child.text)
                    const name = (child as any).name?.trim() || (child as any).text?.trim() || '';

                    const x = (child as any).position?.x ?? 0;
                    const y = (child as any).position?.y ?? 0;
                    const w = (child as any).size?.width ?? 100;
                    const h = (child as any).size?.height ?? 50;

                    await session.run(
                        `MATCH (d:WorkflowDiagram {uuid: $uuid})
                         MERGE (n:Node {id: $nid})
                         SET n.type = $type,
                             n.name = $name,
                             n.x = $x,
                             n.y = $y,
                             n.w = $w,
                             n.h = $h
                         MERGE (d)-[:HAS_NODE]->(n)`,
                        {
                            uuid: sourceUuid,
                            nid,
                            type: child.type,
                            name,
                            x,
                            y,
                            w,
                            h
                        }
                    );

                    this.logger.info(`Saved Node (${child.type}) id=${nid}, name=${name}`);
                }

                if (type.includes('edge')) {
                    const eid = (child as any).id || uuidv4();
                    const src = (child as any).sourceId;
                    const dst = (child as any).targetId;

                    await session.run(
                        `MATCH (d:WorkflowDiagram {uuid: $uuid})
                         MERGE (e:Edge {id: $eid})
                         SET e.type = $type,
                             e.sourceId = $src,
                             e.targetId = $dst
                         MERGE (d)-[:HAS_EDGE]->(e)`,
                        {
                            uuid: sourceUuid,
                            eid,
                            type: child.type,
                            src,
                            dst
                        }
                    );

                    this.logger.info(`🔗 Saved Edge (${child.type}) id=${eid}`);
                }
            }
        } finally {
            await session.close();
        }
    }
}
