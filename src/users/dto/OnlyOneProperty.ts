import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function OnlyOneProperty(property1: string, property2: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'onlyOneProperty',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(_: any, args: ValidationArguments) {
					const obj = args.object as any;
					const hasFirst = !!obj[property1];
					const hasSecond = !!obj[property2];
					// Return true only if exactly one is present
					return (hasFirst || hasSecond) && !(hasFirst && hasSecond);
				},
				defaultMessage(_args: ValidationArguments) {
					return `Exactly one of "${property1}" or "${property2}" must be provided.`;
				},
			},
		});
	};
}
