import {css} from 'lit';


export const styles = css`
  :host {
    --mdc-theme-primary: var(--vvd-color-primary);
    --mdc-theme-on-primary: var(--vvd-color-on-primary);
    --mdc-theme-text-primary-on-background: var(--vvd-color-on-canvas);
    --mdc-theme-secondary: var(--vvd-color-primary);
    --mdc-theme-on-secondary: var(--vvd-color-on-primary);
    --mdc-theme-surface: var(--vvd-color-canvas);
    --mdc-theme-on-surface: var(--vvd-color-on-canvas);
    --mdc-theme-error: var(--vvd-color-alert)
  }
  #title,#content,#actions,#dialog_icon {
    padding-right:0;
    padding-left:0
  }
  ::slotted([slot=icon]) {
    margin-bottom:18px
  }
  #title {
    font:500 condensed 20px / 28px SpeziaWebVariable;
    letter-spacing:0px;
    text-decoration:none;
    text-transform:none;
    padding-bottom:0;
    margin-bottom:8px;
    color:var(--vvd-color-on-canvas)
  }
  #content {
    font:400 ultra-condensed 14px / 20px SpeziaWebVariable;
    letter-spacing:0px;
    text-decoration:none;
    text-transform:none;
    color:var(--vvd-color-on-canvas)
  }
  #actions {
    font:600 ultra-condensed 14px / 20px SpeziaWebVariable;
    letter-spacing:0px;
    text-decoration:none;
    text-transform:none;
    padding-bottom:0
  }
  .mdc-dialog__surface {
    padding:24px
  }
  .mdc-dialog .mdc-dialog__content {
    padding-top:0
  }
  .mdc-dialog__content.last {
    padding-bottom:0
  }
  .mdc-dialog__title::before {
    height:0
  }
  .mdc-dialog .mdc-dialog__scrim {
    background-color:var(--vvd-color-on-canvas);
    opacity:.5
  }
  .dismiss-button {
    display:none
  }
  :host([close-button]) .dismiss-button {
    --vvd-icon-button-color: inherit;
    position:absolute;
    top:16px;
    right:16px;
    display:block
  }
  :host([close-button]) .mdc-dialog__title,:host([close-button]) .mdc-dialog__content {
    width:calc(100% - 32px)
  }
  :host([close-button]) .mdc-dialog__title~.mdc-dialog__content {
    width:100%
  }
`;

