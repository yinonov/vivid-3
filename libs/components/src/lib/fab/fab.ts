import { applyMixins, FoundationElement } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import type { Connotation } from '../enums.js';
import { AffixIconWithTrailing } from '../../shared/patterns/affix';

/**
 * Types of button connotation.
 *
 * @public
 */
export type FabConnotation = Extract<Connotation,
| Connotation.Primary
| Connotation.CTA
| Connotation.Success
| Connotation.Alert>;

/**
 * Base class for fab
 *
 * @public
 */
export class Fab extends FoundationElement {
	/**
	 * Indicates the fab's label.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: label
	 */
	@attr label?: string; 

	/**
	 * The connotation the fab should have.
	 *
	 * @public
	 * @remarks
	 * HTML Attribute: connotation
	 */
	@attr connotation?: FabConnotation;

	/**
	 * Applies disabled mode.
	 *
	 * @public
	 */
	@attr({ mode: 'boolean' }) disabled = false;

}

export interface Fab extends AffixIconWithTrailing { }
applyMixins(Fab, AffixIconWithTrailing);