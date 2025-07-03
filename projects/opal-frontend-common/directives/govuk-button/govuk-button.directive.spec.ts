import { GovukButtonDirective } from './govuk-button.directive';

describe('GovukButtonDirective', () => {
  let directive: GovukButtonDirective;

  beforeEach(() => {
    directive = new GovukButtonDirective();
  });
  it('should create an instance', () => {
    const directive = new GovukButtonDirective();
    expect(directive).toBeTruthy();
  });

  it('should bind the id attribute from buttonId input', () => {
    directive.buttonId = 'test-id';
    expect(directive.id).toEqual('test-id');
  });

  it('should bind the type attribute from type input', () => {
    directive.buttonId = 'btn'; // Required input
    directive.type = 'button';
    expect(directive.buttonType).toEqual('button');

    directive.type = 'reset';
    expect(directive.buttonType).toEqual('reset');
  });

  it('should compute the correct classes', () => {
    directive.buttonId = 'btn';
    directive.buttonClasses = '';
    expect(directive.classes).toEqual('govuk-button');

    directive.buttonClasses = 'extra-class';
    expect(directive.classes).toEqual('govuk-button extra-class');
  });

  it('should have the dataModule attribute set to "govuk-button"', () => {
    expect(directive.dataModule).toEqual('govuk-button');
  });

  it('should emit buttonClickEvent on handleButtonClick()', (done) => {
    directive.buttonId = 'btn'; // Required input to instantiate properly
    directive.buttonClickEvent.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
    directive.handleButtonClick();
  });
});
