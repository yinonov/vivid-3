import {FoundationElement} from '@microsoft/fast-foundation';
import {attr} from '@microsoft/fast-element';
import type {Connotation} from '../enums';

type BannerConnotation =
  Connotation.Info |
  Connotation.Announcement |
  Connotation.Success |
  Connotation.Warning |
  Connotation.Alert;
/**
 * Base class for banner
 *
 * @public
 */
export class Banner extends FoundationElement {
	@attr({mode: 'boolean'}) dismissible = false;
	@attr({mode: 'boolean'}) open = false;
	@attr({attribute: 'aria-live'}) override ariaLive: any;
	@attr() role: string | undefined;
	@attr() text: string | undefined;
	@attr() connotation: BannerConnotation | undefined;
	@attr() icon: string | undefined;

	override attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		super.attributeChangedCallback(name, oldValue, newValue);
		if (name === 'open') {
			this.open ? this.$emit('vwc-banner:opening') : this.$emit('vwc-banner:closing');
		}
	}

	override connectedCallback() {
		super.connectedCallback();
		const banner = this.shadowRoot && this.shadowRoot.querySelector('.banner');
		banner && banner.addEventListener('animationend', this.#emitOnAnimationEnd);
		this.addEventListener('keydown', this.#closeOnKeyDown);
	}

	#emitOnAnimationEnd = () => {
		this.open ? this.$emit('vwc-banner:opened') : this.$emit('vwc-banner:closed');
	};

	#closeOnKeyDown = (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || !this.dismissible) {
			return;
		}
		this.open = false;
	};

	override disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('keydown', this.#closeOnKeyDown);
	}
}
