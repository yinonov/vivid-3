import {elementUpdated, fixture} from '@vivid-nx/shared';
import {TextFieldType} from '@microsoft/fast-foundation';
import {Icon} from '../icon/icon';
import {TextField} from './text-field';
import '.';

const COMPONENT_TAG = 'vwc-text-field';

/**
 * @param element
 */
function getRootElement(element: TextField) {
	return element.shadowRoot?.querySelector('.base') as HTMLElement;
}

describe('vwc-text-field', () => {
	let element: TextField;

	beforeEach(async () => {
		element = (await fixture(
			`<${COMPONENT_TAG}></${COMPONENT_TAG}>`
		)) as TextField;
	});

	describe('basic', () => {
		it('should be initialized as a vwc-text-field', async () => {
			expect(element)
				.toBeInstanceOf(TextField);
		});
	});

	describe('label', function () {
		it('should set a label if label is set', async function () {
			const labelText = 'label';
			element.label = labelText;
			await elementUpdated(element);
			const labelElement = element.shadowRoot?.querySelector('label');
			expect(labelElement)
				.toBeTruthy();
			expect(labelElement?.textContent?.trim())
				.toEqual(labelText);
		});

		it('should show label only if label is set', async function () {
			const labelElement = element.shadowRoot?.querySelector('label');
			expect(labelElement)
				.toBeNull();
		});
	});

	describe('char-count', function () {
		it('should render char-count if attribute char-count and max-length are set', async function () {
			element.charCount = true;
			element.maxlength = 20;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.char-count'))
				.toBeTruthy();
		});

		it('should remove char count if max-length is not set', async function () {
			element.charCount = true;
			element.toggleAttribute('max-length', false);
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.char-count'))
				.toBeNull();
		});

		it('should render count with 0 if value is not set', async function () {
			element.charCount = true;
			element.maxlength = 20;
			const expectedString = '0 / 20';
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.char-count')
				?.textContent
				?.trim())
				.toEqual(expectedString);
		});

		it('should render count according to value and max', async function () {
			element.charCount = true;
			element.maxlength = 20;
			element.value = '12345';
			const expectedString = '5 / 20';
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.char-count')
				?.textContent
				?.trim())
				.toEqual(expectedString);
		});
	});

	describe('readOnly', function () {
		it('should add class readonly to host', async function () {
			const readonlyClassWhenFalse = getRootElement(element)
				.classList
				.contains('readonly');
			element.readOnly = true;
			await elementUpdated(element);
			const readonlyClassWhenTrue = getRootElement(element)
				.classList
				.contains('readonly');
			expect(readonlyClassWhenFalse)
				.toEqual(false);
			expect(readonlyClassWhenTrue)
				.toEqual(true);
		});
	});

	describe('autofocus', function () {
		it('should set autofocus on the input element', async function () {
			element.autofocus = true;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.hasAttribute('autofocus'))
				.toEqual(true);
		});
	});

	describe('placeholder', function () {
		const placeholderText = 'Text';
		it('should set placeholder attribute on the input', async function () {

			element.placeholder = placeholderText;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.getAttribute('placeholder'))
				.toEqual(placeholderText);
		});

		it('should set class placeholder to root', async function () {
			element.placeholder = placeholderText;
			await elementUpdated(element);
			expect(getRootElement(element)
				.classList
				.contains('placeholder'))
				.toEqual(true);
		});
	});

	describe('type', function () {
		const typeText = TextFieldType.text;
		it('should set type attribute on the input', async function () {

			element.type = typeText;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.getAttribute('type'))
				.toEqual(typeText);
		});
	});

	describe('list', function () {
		const dataListID = 'dataListId';

		it('should set list attribute on the input', async function () {
			element.list = dataListID;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.getAttribute('list'))
				.toEqual(dataListID);
		});
	});

	describe('maxlength', function () {
		const value = '8';
		const propertyName = 'maxlength';
		const proxyPropertyName = 'maxLength';

		it('should set maxlength attribute on the input', async function () {

			(element as any)[propertyName] = value;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.getAttribute(propertyName))
				.toEqual(value);
		});

		it('should set maxLength on proxy input', function () {
			(element as any)[propertyName] = value;
			expect((element.proxy as any)[proxyPropertyName])
				.toEqual(Number(value));
		});
	});

	describe('minlength', function () {
		const value = '2';
		const propertyName = 'minlength';
		const proxyPropertyName = 'minLength';

		it('should set minlength attribute on the input', async function () {

			(element as any)[propertyName] = value;
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('input')
				?.getAttribute(propertyName))
				.toEqual(value);
		});

		it('should set minLength on proxy input', function () {
			(element as any)[propertyName] = value;
			expect((element.proxy as any)[proxyPropertyName])
				.toEqual(Number(value));
		});
	});

	describe('form association', function () {
		/**
		 * @param formElement
		 */
		function listenToSubmission(formElement: HTMLFormElement): Promise<FormData> {
			return new Promise((res) => {
				formElement.addEventListener('submit', () => {
					const formData = new FormData(formElement);
					res(formData);
				});
			});
		}

		/**
		 * @param fieldName
		 * @param fieldValue
		 * @param formId
		 * @param otherFormId
		 */
		function createFormHTML(fieldName: string, fieldValue: string, formId: string, otherFormId?: string) {
			const otherForm = otherFormId
				? `<form onsubmit="return false" id="${otherFormId}"><button></button></form>`
				: '';
			formWrapper.innerHTML = `
				<form onsubmit="return false" name="testForm" id="${formId}">
					<${COMPONENT_TAG} name="${fieldName}"
						value="${fieldValue}"
						${otherFormId ? `form="${otherFormId}"` : `form="${formId}"`}>
					</${COMPONENT_TAG}>
					<button></button>
				</form>
				${otherForm}
			`;

			return {
				form: formWrapper.children[0] as HTMLFormElement,
				otherForm: formWrapper.children[1] as HTMLFormElement,
				element: formWrapper.querySelector(COMPONENT_TAG) as TextField,
				button: formWrapper.children[0]?.querySelector('button'),
				otherFormButton: formWrapper.children[1]?.querySelector('button'),
			};
		}

		let fieldValue: string,
			formId: string,
			fieldName: string,
			formWrapper: HTMLElement;

		beforeEach(function () {
			fieldValue = 'field-value';
			fieldName = 'test-field';
			formId = 'test-form-id';
			formWrapper = document.createElement('div');
			document.body.appendChild(formWrapper);
		});

		afterEach(function () {
			formWrapper.remove();
		});

		it('should attach to closest form', async function () {
			const {form: formElement} = createFormHTML(fieldName, fieldValue, formId);

			const submitPromise = listenToSubmission(formElement);
			formElement.requestSubmit();

			(await submitPromise).forEach((formDataValue, formDataKey) => {
				expect(formDataKey)
					.toEqual(fieldName);
				expect(formDataValue)
					.toEqual(fieldValue);
			});
		});

		it('should attach to form when given form id', async function () {
			const {otherForm} = createFormHTML(fieldName, fieldValue, formId, 'otherFormId');

			const submitPromise = listenToSubmission(otherForm);
			otherForm.requestSubmit();

			(await submitPromise).forEach((formDataValue, formDataKey) => {
				expect(formDataKey)
					.toEqual(fieldName);
				expect(formDataValue)
					.toEqual(fieldValue);
			});
		});

		it('should reset the value of the custom element to default on form reset', async function () {
			const {
				form: formElement,
				element
			} = createFormHTML(fieldName, fieldValue, formId);

			element.value = '5';
			formElement.reset();
			await elementUpdated(element);

			expect(element.value)
				.toEqual(fieldValue);
		});
	});

	describe('events', function () {
		it('should emit an input event', async function () {
			const inputPromise = new Promise(res => element.addEventListener('input', () => res(true)));
			const innerInput = element.shadowRoot?.querySelector('input') as HTMLInputElement;
			innerInput.dispatchEvent(new InputEvent('input', {
				bubbles: true,
				composed: true
			}));
			expect(await inputPromise)
				.toEqual(true);
		});

		it('should emit a change event', async function () {
			const inputPromise = new Promise(res => element.addEventListener('change', () => res(true)));
			const innerInput = element.shadowRoot?.querySelector('input') as HTMLInputElement;
			innerInput.dispatchEvent(new InputEvent('change', {
				bubbles: true,
				composed: true
			}));
			expect(await inputPromise)
				.toEqual(true);
		});
	});

	describe('helper text', function () {
		it('should render the helper text when attribute is set', async function () {
			const helperTextElementWithoutText = element.shadowRoot?.querySelector('.helper-text');
			const helperText = 'Helper Text';
			element.helperText = helperText;
			await elementUpdated(element);
			expect(helperTextElementWithoutText)
				.toBeNull();
			expect(element.shadowRoot?.querySelector('.helper-text')
				?.textContent
				?.trim())
				.toEqual(helperText);
		});
	});

	describe('error message', function () {

		/**
		 * @param errorMessage
		 */
		function setValidityToError(errorMessage = 'error') {
			element.setValidity({badInput: true}, errorMessage);
			element.validate();
		}

		it('should add class error to root', async function () {
			element.dirtyValue = true;
			setValidityToError('blah');
			await elementUpdated(element);
			expect(getRootElement(element)
				.classList
				.contains('error'))
				.toEqual(true);
		});

		it('should render the error message when attribute is set', async function () {
			const errorElementWithoutText = element.shadowRoot?.querySelector('.error-message');
			const errorMessage = 'Error Text';
			element.dirtyValue = true;
			setValidityToError(errorMessage);
			await elementUpdated(element);
			expect(errorElementWithoutText)
				.toBeNull();
			expect(element.shadowRoot?.querySelector('.error-message')
				?.textContent
				?.trim())
				.toEqual(errorMessage);
		});

		it('should replace helper text', async function () {
			element.helperText = 'helper text';
			element.dirtyValue = true;
			setValidityToError();
			await elementUpdated(element);
			expect(element.shadowRoot?.querySelector('.helper-text'))
				.toBeNull();
		});

		it('should set error message to empty string when pristine', async function () {
			setValidityToError();
			await elementUpdated(element);
			expect(element.errorValidationMessage)
				.toEqual('');
		});
	});

	describe('disabled', function () {
		it('should set disabled class when attribute is set', async function () {
			const disabledClassWhenEnabled = getRootElement(element)
				.classList
				.contains('disabled');
			element.disabled = true;
			await elementUpdated(element);
			const disabledClassWhenDisabled = getRootElement(element)
				.classList
				.contains('disabled');
			expect(disabledClassWhenEnabled)
				.toEqual(false);
			expect(disabledClassWhenDisabled)
				.toEqual(true);
		});
	});

	describe('value', function () {
		it('should set \'has-value\' class when there is a value', async function () {
			const activeClassWhenEnabled = getRootElement(element)
				.classList
				.contains('has-value');
			element.value = '5';
			await elementUpdated(element);
			const activeClassWhenDisabled = getRootElement(element)
				.classList
				.contains('has-value');
			expect(activeClassWhenEnabled)
				.toEqual(false);
			expect(activeClassWhenDisabled)
				.toEqual(true);
		});
	});

	describe('density', function () {
		it('should set the size class on the root', async function () {
			const density = 'extended';
			element.setAttribute('density', density);
			await elementUpdated(element);

			expect(getRootElement(element)
				.classList
				.contains('density-extended'))
				.toEqual(true);
		});
	});

	describe('appearance', function () {
		it('should set the shape class on the root', async function () {
			const appearance = 'filled';
			element.setAttribute('appearance', appearance);
			await elementUpdated(element);

			expect(getRootElement(element)
				.classList
				.contains('appearance-filled'))
				.toEqual(true);
		});
	});

	describe('shape', function () {
		it('should set the shape appearance class on the base', async function () {
			const shape = 'pill';
			element.setAttribute('shape', shape);
			await elementUpdated(element);

			expect(getRootElement(element)
				.classList
				.contains('shape-pill'))
				.toEqual(true);
		});
	});

	describe('icon', function () {
		it('should render the icon with type', async function () {
			const iconExistsWithoutAttribute = element.shadowRoot?.querySelector('vwc-icon');
			element.setAttribute('icon', 'home');
			await elementUpdated(element);
			const iconElement = element.shadowRoot?.querySelector('vwc-icon');
			expect(iconExistsWithoutAttribute)
				.toBeFalsy();
			expect(iconElement instanceof Icon)
				.toEqual(true);
			expect(iconElement?.getAttribute('type'))
				.toEqual('home');
		});
	});
});
