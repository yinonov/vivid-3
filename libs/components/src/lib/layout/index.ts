import type { FoundationElementDefinition } from '@microsoft/fast-foundation';
import { designSystem } from '../../shared/design-system';
import { Layout } from './layout';
import { layoutTemplate as template } from './layout.template';

const styles = require('./layout.scss')[0];

/**
 * Represents a layout custom element.
 * layout is...
 */
export const VIVIDLayout = Layout.compose<FoundationElementDefinition>({
	baseName: 'layout',
	template: template as any,
	styles,
});

designSystem.register(VIVIDLayout());
