import { ValidationResult } from './ValidationResult';
import { Validator } from './Validator';
import { ValidatorCategory } from './ValidatorCategory';

// @ts-ignore
export abstract class PasswordValidator implements Validator {
  private readonly rule: number;
  private readonly validatorCategory: ValidatorCategory;

  protected constructor(category: ValidatorCategory, passwordRule: number) {
    this.rule = passwordRule;
    this.validatorCategory = category;
  }

  public passwordRule(): number {
    return this.rule;
  }

  public category() {
    return this.validatorCategory;
  }

  public conflictsWith(validator: PasswordValidator): String[] {
    return [];
  }

  public abstract validate(password: string): ValidationResult;

}