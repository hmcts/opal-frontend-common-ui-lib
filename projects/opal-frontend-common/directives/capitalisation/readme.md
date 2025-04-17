⸻

Capitalisation Directive

This Angular directive automatically capitalises all characters in an input field in real-time as the user types. It is used to ensure consistent formatting in fields like reference numbers or codes.

Table of Contents
• Installation
• Usage
• Inputs
• Outputs
• Methods
• Testing
• Contributing

⸻

Installation

import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';

Ensure the directive is declared in your component:

@Component({
imports: [CapitalisationDirective]
})
export class SharedModule {}

⸻

Usage

You can apply the directive to any component or element that contains an <input> element inside it. The directive listens to the input event and transforms the value to uppercase.

Example Usage with Native Input:

<div capitaliseAllCharacters>
  <input type="text" />
</div>

Example Usage with Custom Component:

<opal-lib-govuk-text-input
capitaliseAllCharacters
inputId="exampleInput"
inputName="exampleInput"
labelText="Reference Number"
[control]="form.controls['exampleInput']"
/>

The directive will automatically find the first <input> element inside the host component.

⸻

Inputs

There are no configurable inputs for this directive.

⸻

Outputs

This directive does not emit any outputs.

⸻

Methods

capitalise(value: string): string

This private method uses the UtilsService to convert a string to uppercase.

private capitalise(value: string): string {
return this.utilsService.upperCaseAllLetters(value);
}

⸻

Testing

Unit tests for this directive are located in the capitalisation.directive.spec.ts file.

To run the tests, use:

yarn test

⸻

Contributing

Feel free to submit issues or pull requests to improve this directive. If you encounter any bugs or missing functionality, please raise an issue.

⸻
