import { elementUpdated, fixture } from '@vivid-nx/shared';
import { toHaveNoViolations } from 'jest-axe';
import { Calendar } from './calendar';
import '.';
import { getValidDateString } from './helpers/calendar.date-functions';
import type { CalendarEventContext } from './helpers/calendar.event-context';

expect.extend(toHaveNoViolations);


const COMPONENT_TAG = 'vwc-calendar';

describe('vwc-calendar', () => {
	let element: Calendar;

	beforeEach(async () => {
		element = (await fixture(
			`<${COMPONENT_TAG}></${COMPONENT_TAG}>`
		)) as Calendar;
	});

	describe('basic', () => {
		it('should be initialized as a vwc-calendar', async () => {
			expect(element).toBeInstanceOf(Calendar);
			expect(element.datetime).toBeUndefined();
			expect(element.locales).toBeUndefined();
			expect(element.hour12).toBeFalsy();
		});
	});

	describe('datetime', () => {
		it('should show recent monday as first day of this week', async () => {
			const calendarFirstDate = getCalendarFirstDate(element);

			const today = getValidDateString(new Date());
			const monday = getMonday(today);

			expect(calendarFirstDate).toEqual(monday);
		});

		it('should show recent monday as first day of \'2022-01-01\' week', async () => {
			const date = '2022-01-01';

			element.datetime = date;
			await elementUpdated(element);

			const calendarFirstDate = getCalendarFirstDate(element);
			const monday = getMonday(date);

			expect(calendarFirstDate).toEqual(monday);
		});
	});

	describe('startDay', () => {
		it('should show recent sunday as first day of this week', async () => {
			element.startDay = 'sunday';
			await elementUpdated(element);

			const calendarFirstDate = getCalendarFirstDate(element);

			const today = getValidDateString(new Date());
			const sunday = getSunday(today);

			expect(calendarFirstDate).toEqual(sunday);
		});

		it('should show recent sunday as first day of \'2022-01-01\' week', async () => {
			element.startDay = 'sunday';
			const date = '2022-01-01';

			element.datetime = date;
			await elementUpdated(element);

			const calendarFirstDate = getCalendarFirstDate(element);
			const sunday = getSunday(date);

			expect(calendarFirstDate).toEqual(sunday);
		});
	});

	describe('locales', () => {
		it('should set hebrew locales', async () => {
			const date = '2022-01-01';
			element.datetime = date;
			element.locales = 'he-il';

			await elementUpdated(element);

			const calendarFirstDate = element.shadowRoot?.querySelector('.column-headers > :first-child small') as HTMLElement;

			expect(calendarFirstDate.textContent?.trim()).toEqual('יום ב׳');
		});
	});

	describe('hour12', () => {
		it('should set hebrew locales', async () => {
			element.hour12 = true;

			await elementUpdated(element);

			const hour13th = element.shadowRoot?.querySelector('.row-headers > :nth-child(13)') as HTMLSpanElement;

			expect(hour13th.textContent?.trim()).toEqual('1 PM');
		});
	});

	describe('Event Context', () => {
		let gridCell: HTMLElement;
		let context: CalendarEventContext;

		beforeEach(async () => {
			gridCell = element.shadowRoot?.querySelector('[role="gridcell"i]:nth-child(3)') as HTMLElement;
		});

		it('should return correct day and hour from mouse click event', async () => {
			// needed in order to test hour. see comment below
			// const { style } = element.parentElement as HTMLElement;
			// style.height = '1200px';
			// style.position = 'fixed';
			// style.top = '0px';

			element.addEventListener('click', e => context = element.getEventContext(e) as CalendarEventContext);
			gridCell = element.shadowRoot?.querySelector('[role="gridcell"i]:nth-child(3)') as HTMLElement;

			gridCell.dispatchEvent(new MouseEvent('click', { composed: true, clientX: 20, clientY: 14 }));

			expect(context.day).toEqual(2);
			// the following can't be tested due to JSDOM limitations.
			// see https://github.com/jsdom/jsdom/issues/2843#issuecomment-599110255
			// expect(context.hour).toEqual(0.2);
		});

		it('should return day and hour from keydown \'space\' event', async () => {
			element.addEventListener('keydown', e => context = element.getEventContext(e) as CalendarEventContext);

			gridCell.dispatchEvent(new KeyboardEvent('keydown', { composed: true, keyCode: 13 }));

			expect(context.day).toEqual(2);
			expect(context.hour).toEqual(undefined);
		});

		it('should return day and hour from keydown \'enter\' event', async () => {
			element.addEventListener('keydown', e => context = element.getEventContext(e) as CalendarEventContext);

			gridCell.dispatchEvent(new KeyboardEvent('keydown', { composed: true, keyCode: 32 }));

			expect(context.day).toEqual(2);
			expect(context.hour).toEqual(undefined);
		});
	});

	describe('focus management', () => {
		let gridCell: HTMLElement;

		beforeEach(async () => {
			gridCell = element.shadowRoot?.querySelector('[role="gridcell"i]:nth-child(3)') as HTMLElement;
		});

		it('should change focus on keyboard arrow interactions', async () => {
			const { shadowRoot } = element;
			// const grid = shadowRoot?.querySelector('[role="grid"i]');
			gridCell?.focus();

			expect(shadowRoot?.activeElement).toBe(gridCell);
			// const getRole = (role: string, i: number) => shadowRoot?.querySelector(`[role="${role}"i]:nth-child(${i})`);

			const moveToElement = (key: string) => {
				element?.dispatchEvent(new KeyboardEvent('keydown', { key }));
				return shadowRoot?.activeElement;
			};
			moveToElement('ArrowRight');
			const focusedElementAfterMovingRight = moveToElement('ArrowRight');
			// const focusedElementAfterMovingLeft = moveToElement('ArrowLeft');
			// const focusedElementAfterMovingUp = moveToElement('ArrowUp');
			// const focusedElementAfterMovingDown = moveToElement('ArrowDown');

			expect(focusedElementAfterMovingRight).toEqual(2);
			// expect(focusedElementAfterMovingRight).toEqual(getRole('columnheader', 4));
			// expect(focusedElementAfterMovingLeft).toEqual(getRole('columnheader', 3));
			// expect(focusedElementAfterMovingUp).toEqual(getRole('gridcell', 3));
			// expect(focusedElementAfterMovingDown).toEqual(getRole('columnheader', 3));
		});
	});

	describe('a11y', () => {
		// const addElement = isolatedElementsCreation();

		// const addCalendarElement = async (content) => {
		// 	const [actualElement] = addElement(
		// 		textToDomToParent(`<${COMPONENT_NAME}>${content || ''}</${COMPONENT_NAME}>`)
		// 	);
		// 	await actualElement.updateComplete;

		// 	return actualElement;
		// };

		// const extractCalendarElements = (actualElement) => {
		// 	const { shadowRoot } = actualElement;
		// 	return {
		// 		actualElement,
		// 		shadowRoot,
		// 		grid: shadowRoot.querySelector('[role="grid"i]')
		// 	};
		// };

		// const createKEvent = key => new KeyboardEvent('keydown', { key });

		// it('should pass accessibility test', async () => {
		// 	const { shadowRoot } = element;
		// 	if (!shadowRoot) { return; }

		// 	const results = await axe(shadowRoot.innerHTML);
		// 	expect(results).toHaveNoViolations();
		// });

		// describe('keyboard events', () => {
		// 	it('should focus to default on initial keyboard interaction', async () => {
		// 		const { shadowRoot, grid } = extractCalendarElements(await addCalendarElement());

		// 		grid.dispatchEvent(createKEvent('ArrowDown'));

		// 		const defaultFocusElement = grid.querySelector('[role="columnheader"i]');

		// 		expect(shadowRoot.activeElement).to.equal(defaultFocusElement);
		// 	});



		// 	it('should move focus from calendar event to containing gridcell on \'arrowUp\'', async () => {
		// 		const eventComponent = 'vwc-calendar-event';

		// 		const { actualElement, shadowRoot, grid } = extractCalendarElements(await addCalendarElement(
		// 			`<${eventComponent} slot="day-2" start="4" duration="5"></${eventComponent}>`
		// 		));

		// 		actualElement.querySelector(eventComponent)
		// 			.shadowRoot.querySelector('section')
		// 			.focus();

		// 		grid.dispatchEvent(createKEvent('ArrowUp'));

		// 		expect(shadowRoot.activeElement).to.equal(
		// 			grid.querySelector('[role="gridcell"i]:nth-child(3)')
		// 		);
		// 	});

		// 	it('should move focus from column header button to gridcell of same block on \'arrowDown\'', async () => {
		// 		const { actualElement, shadowRoot, grid } = extractCalendarElements(await addCalendarElement());

		// 		const columnHeader = actualElement.shadowRoot.querySelector('[role="columnheader"i]:nth-child(3)');
		// 		columnHeader.querySelector('[role="button"i]').focus();

		// 		grid.dispatchEvent(createKEvent('ArrowDown'));

		// 		expect(shadowRoot.activeElement).to.equal(
		// 			grid.querySelector('[role="gridcell"i]:nth-child(3)')
		// 		);
		// 	});
		// });
	});
});

/**
 * @param element
 */
function getCalendarFirstDate(element: Calendar) {
	const firstColumnTimeEl = element.shadowRoot?.querySelector('.column-headers > :first-child time') as HTMLTimeElement;
	const firstDatetime = firstColumnTimeEl?.getAttribute('datetime') as string;
	return new Date(firstDatetime);
}

/**
 * @param d
 */
function getMonday(d: Date | string) {
	d = new Date(d);
	const day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}

/**
 * @param d
 */
function getSunday(d: Date | string) {
	d = new Date(d);
	const day = d.getDay(),
		diff = d.getDate() - day;
	return new Date(d.setDate(diff));
}
