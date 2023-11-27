import { ValidationResult, ValidatorCategory } from '.';
import { PasswordValidator } from './PasswordValidator';

export class SpaceCharacterValidator extends PasswordValidator {

  constructor() {
    super(ValidatorCategory.PATTERN_MATCHER, 0);
  }

  public validate(password: string): ValidationResult {
    if (this.containsSpaceCharacter(password)) {
      const message: string = `must not contain any space.`;

      return new ValidationResult(false, Array.of(message));
    }

    return new ValidationResult(true, Array.of());
  }

  private containsSpaceCharacter(password: string): boolean {
    return password.split(' ').length > 1;
  }
}