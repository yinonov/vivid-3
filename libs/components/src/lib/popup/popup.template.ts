import { html } from '@microsoft/fast-element';
import { classNames } from '@microsoft/fast-web-utilities';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { ElementDefinitionContext, FoundationElementDefinition } from '@microsoft/fast-foundation';
import type { Popup } from './popup';

const getClasses = ({
	open, dismissible, alternate
}: Popup) => classNames(
	'control',
	['open', Boolean(open)],
	['dismissible', Boolean(dismissible)],
	['alternate', Boolean(alternate)]
);

/**
 * The template for the {@link @vonage/vivid#Popup} component.
 *
 * @returns {ViewTemplate<Popup>} A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
export const popupTemplate: (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => ViewTemplate<Popup> = () => html`
	<div class="wrapper">
		<vwc-elevation dp="2">
			<div class="${getClasses}" aria-hidden="${(x) => x.open ? 'false' : 'true'}"
				part="${(x) => x.alternate ? 'vvd-scheme-alternate' : ''}">
				<div class="content">
					<slot></slot>
					${(x) => (x.dismissible ? renderDismissButton() : '')}
				</div>
				${(x) => (x.arrow ? renderArrow() : '')}
			</div>
		</vwc-elevation>
	</div>`;

const renderDismissButton = () => {
	return html`<vwc-icon-button @click="${x => x.handleDismissClick()}" class="dismissible" icon="close-small-solid"
	shape="circled" dense></vwc-icon-button>`;
};

const renderArrow = () => {
	return html`<div class="arrow"></div>`;
};