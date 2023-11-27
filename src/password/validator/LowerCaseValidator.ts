import { ValidationResult, ValidatorCategory } from '.';
import { PasswordValidator } from './PasswordValidator';
import { Util } from './Util';

export class LowerCaseValidator extends PasswordValidator {

  constructor(passwordRule: number) {
    super(ValidatorCategory.LENGTH_EXPANDER, passwordRule);
  }


  public validate(password: string): ValidationResult {
    if (this.numberOfLowercaseCharactersIn(password) < this.passwordRule()) {
      const message = `must contain at least ${this.passwordRule()} lowercase letters.`;

      return new ValidationResult(false, Array.of(message));
    }

    return new ValidationResult(true, Array.of());
  }

  private numberOfLowercaseCharactersIn(password: string): number {
    return Util.removeNonAlphabeticCharacterFrom(password)
      .split("")
      .filter(char => char.toLowerCase() === char)
      .length;
  }
}