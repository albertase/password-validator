import { ValidationResult } from './ValidationResult';

export interface Validator {

  validate(password: string): ValidationResult;
}