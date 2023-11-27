// min 6, max 10, 1 digit

import {
  DigitValidator,
  LowerCaseValidator,
  MaxLengthValidator,
  MinLengthValidator,
  PasswordValidatorManager,
  SpaceCharacterValidator,
  SpecialCharacterValidator,
  UpperCaseValidator
} from '../validator';

const pm = new PasswordValidatorManager();

const min = new MinLengthValidator(6);
const max = new MaxLengthValidator(8);
const dig = new DigitValidator(1);
const lcv = new LowerCaseValidator(3);
const upv = new UpperCaseValidator(1);
const spci = new SpecialCharacterValidator(1);
const sbv = new SpaceCharacterValidator();

pm.register(min, max, dig, lcv, upv, spci, sbv);

const validationResult = pm.validate('dvD LD');

if (validationResult.isValid()) {
  console.log('Password is valid...');
} else {
  console.log('Password failed validation:');

  for (const message of validationResult.getMessages()) {

    console.log(`\t* ${message}`);
  }
}