import { PasswordValidator } from './PasswordValidator';
import { Validator } from './Validator';

export interface ValidatorManager extends Validator {

  register(...validators: PasswordValidator[]): void;

  validators(): PasswordValidator[];
}