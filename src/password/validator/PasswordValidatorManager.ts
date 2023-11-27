import { PasswordValidator } from './PasswordValidator';
import { PasswordValidatorConflictException } from './PasswordValidatorConflictException';
import { ValidationResult } from './ValidationResult';
import { ValidatorManager } from './ValidatorManager';

export class PasswordValidatorManager implements ValidatorManager{
  private readonly registeredValidators: PasswordValidator[];

  constructor() {
    this.registeredValidators = [];
  }

  public register(...validators: PasswordValidator[]): void {
    const conflictMessages: String[] = [];

    this.verifyEachValidatorAgainstThemselves(validators, conflictMessages);

    for (let validator of validators) {

      this.verifyAgainstOtherValidators(validator, conflictMessages);

      this.registerValidatorWithNoConflict(conflictMessages, validator);
    }

    this.handleConflicts(conflictMessages);
  }

  private verifyEachValidatorAgainstThemselves(validators: PasswordValidator[], conflictMessages: String[]): void {
    for (let i = 0; i < validators.length; i++) {
      for (let j = i + 1; j < validators.length; j++) {
        let conflictMsg = validators[i].conflictsWith(validators[j]);
        if (conflictMsg.length > 0) {
          conflictMessages.push(...conflictMsg);
        }
      }
    }
  }

  private verifyAgainstOtherValidators(validator: PasswordValidator, conflictMessages: String[]): void {
    for (let registeredValidator of this.registeredValidators) {
      let conflictMsg = validator.conflictsWith(registeredValidator);

      if (this.hasConflict(conflictMsg)) {
        conflictMessages.push(...conflictMsg);

        break;
      }
    }
  }

  private registerValidatorWithNoConflict(conflictMessages: String[], validator: PasswordValidator): void {
    if (!this.hasConflict(conflictMessages)) {
      this.registeredValidators.push(validator);
    }
  }

  private handleConflicts(conflictMessages: String[]): void {
    if (this.hasConflict(conflictMessages)) {
      let message: string = '';
      let errorCount: number = 0;

      for (let conflictMessage of conflictMessages) {
        errorCount++;

        message += `${errorCount}: ${conflictMessage}\n`;
      }

      throw new PasswordValidatorConflictException(message);
    }
  }

  private hasConflict(conflictMsg: String[]): boolean {
    return conflictMsg.length > 0;
  }

  public validators(): PasswordValidator[] {
    return this.registeredValidators;
  }

  public validate(password: string): ValidationResult {
    const messages: string[] = [];
    let isValid: boolean = true;

    for (const validator of this.registeredValidators) {
      const result = validator.validate(password);

      if (result.isValid()) {
        continue;
      }

      isValid = false;
      messages.push(...result.getMessages());
    }

    return new ValidationResult(isValid, messages);
  }
}