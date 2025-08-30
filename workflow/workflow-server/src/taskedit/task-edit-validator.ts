import { ContextEditValidator, RequestEditValidationAction, ValidationStatus } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { TaskEditContextActionProvider } from './task-edit-context-provider';

@injectable()
export class TaskEditValidator implements ContextEditValidator {
    readonly contextId = 'task-editor';

    validate(action: RequestEditValidationAction): ValidationStatus {
        const text = action.text;

        if (text.startsWith(TaskEditContextActionProvider.DURATION_PREFIX)) {
            const durationString = text.substring(TaskEditContextActionProvider.DURATION_PREFIX.length);
            const duration = Number.parseInt(durationString, 10);

            if (Number.isNaN(duration)) {
                return { severity: ValidationStatus.Severity.ERROR, message: `'${durationString}' is not a valid number.` };
            } else if (duration < 0 || duration > 100) {
                return { severity: ValidationStatus.Severity.WARNING, message: `'${durationString}' should be between 0 and 100` };
            }
        } else if (text.startsWith(TaskEditContextActionProvider.TYPE_PREFIX)) {
            const typeString = text.substring(TaskEditContextActionProvider.TYPE_PREFIX.length);

            if (
                typeString !== 'automated' &&
                typeString !== 'manual' &&
                typeString !== 'automatedCp' &&
                typeString !== 'manualCp' &&
                typeString !== 'hybrid' &&
                typeString !== 'autonomous' &&
                typeString !== 'cognitive'
            ) {
                return {
                    severity: ValidationStatus.Severity.ERROR,
                    message: `'Type of task can only be manual, automated, hybrid, autonomous, cognitive, manualCp or automatedCp. You entered '${typeString}'.`
                };
            }
        }

        return ValidationStatus.NONE;
    }
}
