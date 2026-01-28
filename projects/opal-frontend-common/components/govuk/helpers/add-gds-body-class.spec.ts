import { addGdsBodyClass } from './add-gds-body-class';

describe('addGdsBodyClass', () => {
  let initialBodyClassName = '';

  beforeEach(() => {
    initialBodyClassName = document.body.className;
  });

  afterEach(() => {
    document.body.className = initialBodyClassName;
  });

  it('should add govuk-frontend-supported class to the body', () => {
    document.body.classList.remove('govuk-frontend-supported', 'js-enabled');
    expect(document.body.classList.contains('govuk-frontend-supported')).toBeFalse();
    addGdsBodyClass();
    expect(document.body.classList.contains('govuk-frontend-supported')).toBeTrue();
  });

  it('should add js-enabled class to the body', () => {
    document.body.classList.remove('govuk-frontend-supported', 'js-enabled');
    expect(document.body.classList.contains('js-enabled')).toBeFalse();
    addGdsBodyClass();
    expect(document.body.classList.contains('js-enabled')).toBeTrue();
  });

  it('should not add duplicate classes if already present', () => {
    document.body.className = initialBodyClassName;
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
    const initialClassListLength = document.body.classList.length;

    addGdsBodyClass();

    expect(document.body.classList.length).toBe(initialClassListLength);
  });
});
