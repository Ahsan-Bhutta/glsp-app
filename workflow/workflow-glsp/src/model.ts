import {
    DiamondNode,
    EditableLabel,
    GChildElement,
    GEdge,
    GModelElement,
    GShapeElement,
    LayoutContainer,
    Nameable,
    RectangularNode,
    ResizableModelElement,
    WithEditableLabel,
    boundsFeature,
    connectableFeature,
    deletableFeature,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutContainerFeature,
    layoutableChildFeature,
    moveFeature,
    nameFeature,
    popupFeature,
    selectFeature,
    withEditLabelFeature
} from '@eclipse-glsp/client';

export class TaskNode extends RectangularNode implements Nameable, WithEditableLabel {
    static override readonly DEFAULT_FEATURES = [
        connectableFeature,
        deletableFeature,
        selectFeature,
        boundsFeature,
        moveFeature,
        layoutContainerFeature,
        fadeFeature,
        hoverFeedbackFeature,
        popupFeature,
        nameFeature,
        withEditLabelFeature
    ];
    duration?: number;
    taskType?: string;
    reference?: string;

    get editableLabel(): (GChildElement & EditableLabel) | undefined {
        const label = this.children.find(element => element.type === 'label:heading');
        if (label && isEditableLabel(label)) {
            return label;
        }
        return undefined;
    }

    get name(): string {
        const labelText = this.editableLabel?.text;
        return labelText ? labelText : '<unknown>';
    }
}

// Circular Node
export class CircularNode extends RectangularNode implements Nameable, WithEditableLabel {
    static override readonly DEFAULT_FEATURES = [
        connectableFeature,
        deletableFeature,
        selectFeature,
        boundsFeature,
        moveFeature,
        layoutContainerFeature,
        fadeFeature,
        hoverFeedbackFeature,
        popupFeature,
        nameFeature,
        withEditLabelFeature
    ];
    duration?: number;
    taskType?: string;
    reference?: string;

    get editableLabel(): (GChildElement & EditableLabel) | undefined {
        const label = this.children.find(element => element.type === 'label:heading');
        if (label && isEditableLabel(label)) {
            return label;
        }
        return undefined;
    }

    get name(): string {
        const labelText = this.editableLabel?.text;
        return labelText ? labelText : '<unknown>';
    }
}

// --- Cp Task Nodes ---
export class AutomatedTaskCpNode extends TaskNode {}
export class ManualTaskCpNode extends TaskNode {}

export function isTaskNode(element: GModelElement): element is TaskNode {
    return element instanceof TaskNode || false;
}

export class WeightedEdge extends GEdge {
    probability?: string;
}

export class ControlNode extends DiamondNode implements ResizableModelElement {
    nodeType: string = ActivityNode.Type.UNDEFINED;
    override size = {
        width: 32,
        height: 32
    };
    override strokeWidth = 1;
}

export class BranchingNode extends ControlNode {}
export class SynchronizationNode extends ControlNode {}

// --- Cp Activity Nodes ---
export class DecisionCpNode extends ControlNode {}
export class MergeCpNode extends ControlNode {}
export class ForkCpNode extends ControlNode {}
export class JoinCpNode extends ControlNode {}

export namespace ActivityNode {
    export namespace Type {
        export const INITIAL = 'initialNode';
        export const FINAL = 'finalNode';
        export const DECISION = 'decisionNode';
        export const MERGE = 'mergeNode';
        export const JOIN = 'joinNode';
        export const FORK = 'forkNode';
        export const UNDEFINED = 'undefined';

        // My Work for eclipse-glsp (Cp types)
        export const DECISION_CP = 'decisionCp';
        export const MERGE_CP = 'mergeCp';
        export const FORK_CP = 'forkCpNode';
        export const JOIN_CP = 'joinCpNode';
        export const HYBRID_TASK = 'hybrid';
        export const AUTONOMOUS_TASK = 'autonomous';
        export const COGNITIVE_TASK = 'cognitive';
    }
}

export class Icon extends GShapeElement implements LayoutContainer {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, layoutableChildFeature, fadeFeature];

    layout: string;
    override layoutOptions?: { [key: string]: string | number | boolean };
    override size = {
        width: 32,
        height: 32
    };
}

export class CategoryNode extends RectangularNode implements Nameable, WithEditableLabel {
    static override readonly DEFAULT_FEATURES = [
        deletableFeature,
        selectFeature,
        boundsFeature,
        moveFeature,
        layoutContainerFeature,
        fadeFeature,
        hoverFeedbackFeature,
        popupFeature,
        nameFeature,
        withEditLabelFeature
    ];

    name = '';

    get editableLabel(): (GChildElement & EditableLabel) | undefined {
        const label = this.children.find(element => element.type === 'label:heading');
        if (label && isEditableLabel(label)) {
            return label;
        }
        return undefined;
    }
}

// --- Cp Category Node ---
export class CategoryCpNode extends CategoryNode {}
