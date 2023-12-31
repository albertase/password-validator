import {
  DigitValidator,
  LowerCaseValidator,
  MaxLengthValidator,
  MinLengthValidator,
  PasswordValidator,
  PasswordValidatorConflictException,
  PasswordValidatorManager,
  UpperCaseValidator,
  ValidationResult,
  ValidatorManager,
} from '../password/validator';
import { SpaceCharacterValidator } from '../password/validator/SpaceCharacterValidator';
import { SpecialCharacterValidator } from '../password/validator/SpecialCharacterValidator';


it('should create a password validator manager', (): void => {
  const pm: ValidatorManager = new PasswordValidatorManager();

  expect(pm).toBeTruthy();
});

describe.each([
  { validators: [MinLengthValidator], expected: 1 },
  { validators: [MinLengthValidator, MaxLengthValidator], expected: 2 },
  { validators: [MinLengthValidator, MaxLengthValidator, DigitValidator], expected: 3 },
])('Password Validators Registration', ({ validators, expected }) =>

    it(`should be able to register ${expected} validator`, (): void => {
      const pm: ValidatorManager = new PasswordValidatorManager();

      const validatorInstances: PasswordValidator[] = [];
      validators.forEach(Validator => validatorInstances.push(new Validator(1)));

      pm.register(...validatorInstances);
      expect(pm.validators().length).toBe(expected);
    }));

describe.each([
  {
    conflicts: {
      key: 1,
      validators: [
        { validator: MinLengthValidator, rule: 6 },
        { validator: MaxLengthValidator, rule: 3 },
      ]
    }
  },
  {
    conflicts: {
      key: 2,
      validators: [
        { validator: MinLengthValidator, rule: 2 },
        { validator: MaxLengthValidator, rule: 3 },
        { validator: DigitValidator, rule: 4 },
      ]
    }
  }
])('Conflict Validation', ({ conflicts }) => {
  it(`should check for conflicts before registration ${conflicts.key}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const validatorInstances: PasswordValidator[] = [];

    conflicts.validators.forEach((Password) => {
      validatorInstances.push(new Password.validator(Password.rule));
    });

    expect(() => pm.register(...validatorInstances)).toThrow(PasswordValidatorConflictException);
  });
});

describe.each([
  { password: "Ilsd", rule: 3, expected: true },
  { password: "pass", rule: 5, expected: false },
  { password: "Id", rule: 3, expected: false },
  { password: "password", rule: 3, expected: true },
  { password: "dotnet", rule: 6, expected: true },
])('Minimum Length Validation', ({password, rule, expected}): void => {
  it(`should validate minLength ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const minLength: PasswordValidator = new MinLengthValidator(rule);
    pm.register(minLength);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "Ilsd", rule: 4, expected: true },
  { password: "pass", rule: 5, expected: true },
  { password: "Id_consumer", rule: 6, expected: false },
  { password: "password", rule: 3, expected: false },
  { password: "dotnet", rule: 6, expected: true },
])('Maximum Length Validation', ({password, rule, expected}): void => {
  it(`should validate maxLength ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const maxLengthValidator: PasswordValidator = new MaxLengthValidator(rule);
    pm.register(maxLengthValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "Ilsd", minRule: 2, maxRule: 4, expected: true },
  { password: "ps", minRule: 3, maxRule: 4, expected: false },
  { password: "Id_consumer", minRule: 6, maxRule: 8, expected: false },
  { password: "passwd", minRule: 4, maxRule: 6, expected: true },
  { password: "dotnet", minRule: 5, maxRule: 10, expected: true },
])('Minimum & Maximum Length Validation', ({password, minRule, maxRule, expected}): void => {
  it(`should validate minimumLength ${minRule} maxLength ${maxRule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const minLengthValidator: PasswordValidator = new MinLengthValidator(minRule);
    const maxLengthValidator: PasswordValidator = new MaxLengthValidator(maxRule);

    pm.register(minLengthValidator, maxLengthValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "Ilsd12", rule: 1, expected: true },
  { password: "pass1", rule: 2, expected: false },
  { password: "Id0_consume4r", rule: 3, expected: false },
  { password: "pa3sswor8d", rule: 4, expected: false },
  { password: "d2o34tne5tw3", rule: 5, expected: true },
])('Password Digit Validation', ({password, rule, expected}): void => {
  it(`should validate minimum digit ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const digitValidator: PasswordValidator = new DigitValidator(rule);
    pm.register(digitValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "LAJDEs3", rule: 1, expected: true },
  { password: "pASSEOK", rule: 2, expected: false },
  { password: "LKF(WKF", rule: 3, expected: false },
  { password: "kd (WKF", rule: 3, expected: false },
  { password: "kd!(WKF", rule: 3, expected: false },
  { password: "LKlsdF(WldkKF", rule: 6, expected: true },
  { password: "KFlsKFEIE", rule: 4, expected: false },
  { password: "d2o34tne5tw3", rule: 5, expected: true },
])('Lowercase Validation', ({password, rule, expected}): void => {
  it(`should validate Lowercase ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const lowerCaseValidation: PasswordValidator = new LowerCaseValidator(rule);
    pm.register(lowerCaseValidation);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "kshdkcK", rule: 1, expected: true },
  { password: "adlLdkf", rule: 2, expected: false },
  { password: "LKfslkd", rule: 3, expected: false },
  { password: "LK dkdh", rule: 3, expected: false },
  { password: "LK#dkdh", rule: 3, expected: false },
  { password: "LKlsdF(WldkKF", rule: 6, expected: true },
  { password: "kdvAdk", rule: 4, expected: false },
  { password: "K,dslJGHDmdkL", rule: 5, expected: true },
])('Uppercase Validation', ({password, rule, expected}): void => {
  it(`should validate Uppercase ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const upperCaseValidator: PasswordValidator = new UpperCaseValidator(rule);
    pm.register(upperCaseValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "kshdkcK!", rule: 1, expected: true },
  { password: "amdka", rule: 2, expected: false },
  { password: "LKfslkd", rule: 3, expected: false },
  { password: "LKls)_@%=dF(WldkKF", rule: 6, expected: true },
  { password: "kdvAd!#k", rule: 4, expected: false },
  { password: "K,dslJG#<>HDmd.kL", rule: 5, expected: true },
])('Special Character Validation', ({password, rule, expected}): void => {
  it(`should validate Special Characters ${rule}`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const specialCharacterValidator: PasswordValidator = new SpecialCharacterValidator(rule);
    pm.register(specialCharacterValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

describe.each([
  { password: "kshdkcK!", expected: true },
  { password: "amdka ", expected: false },
  { password: "LKfs lkd", expected: false },
  { password: "WldkKF", expected: true },
  { password: "kdvAd! #k", rule: 4, expected: false },
  { password: "K,dslJG#<>HDmd.kL", rule: 5, expected: true },
])('Space Character Validation', ({password, expected}): void => {
  it(`should validate Space Characters in: "${password}"`, (): void => {
    const pm: ValidatorManager = new PasswordValidatorManager();

    const spaceCharacterValidator: PasswordValidator = new SpaceCharacterValidator();
    pm.register(spaceCharacterValidator);

    const actual: ValidationResult = pm.validate(password);

    expect(actual.isValid()).toBe(expected);
  });
});

  describe.each([
      ['Albert@P_&@Nna0ji', true],
      ['VeryWeakPassword123', false],
      ['!@#Albert@password0', true],
      ['AlbertLehninger', false],
      ['ALBERTJACKSON', false],
      ['SomeSpecial@Chars12', true],
    ])('Complex Password Policy', (password, expected) => {
      it(`should validate a complex password policy: ${password}`, () => {
        const pm: ValidatorManager = new PasswordValidatorManager();

        const minLengthValidator: PasswordValidator = new MinLengthValidator(8);
        const maxLengthValidator: PasswordValidator = new MaxLengthValidator(20);
        const digitValidator: PasswordValidator = new DigitValidator(1);
        const lowerCaseValidator: PasswordValidator = new LowerCaseValidator(1);
        const upperCaseValidator: PasswordValidator = new UpperCaseValidator(1);
        const specialCharacterValidator: PasswordValidator = new SpecialCharacterValidator(1);
        const spaceCharacterValidator: PasswordValidator = new SpaceCharacterValidator();

        pm.register(
            minLengthValidator,
            maxLengthValidator,
            digitValidator,
            lowerCaseValidator,
            upperCaseValidator,
            specialCharacterValidator,
            spaceCharacterValidator
        );

        const actual: ValidationResult = pm.validate(password);

        expect(actual.isValid()).toBe(expected);
      })
    });

