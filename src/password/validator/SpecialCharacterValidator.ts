import { ValidationResult, ValidatorCategory } from '.';
import { PasswordValidator } from './PasswordValidator';

export class SpecialCharacterValidator extends PasswordValidator {

  constructor(passwordRule: number) {
    super(ValidatorCategory.LENGTH_EXPANDER, passwordRule);
  }

  public validate(password: string): ValidationResult {
    if (this.numberOfSpecialCharactersIn(password) < this.passwordRule()) {
      const message = `must contain at least ${this.passwordRule()} special characters.`;

      return new ValidationResult(false, Array.of(message));
    }

    return new ValidationResult(true, Array.of());
  }

  private numberOfSpecialCharactersIn(password: string): number {
    let specialCharacters = '!@#$%^&*()_+-=[]{}|;\':",.<>/?`~';

    return password
      .split('')
      .filter(char => specialCharacters.includes(char))
      .length;
  }
}