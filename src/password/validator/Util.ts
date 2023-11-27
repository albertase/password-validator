export class Util {

  public static removeNonAlphabeticCharacterFrom(word: string): string {
    const SPACE_CHARACTER: string = ' ';
    const SPECIAL_CHARACTERS: string = '!@#$%^&*()_+-=[]{}|;\':",.<>/?`~';

    return word
      .split('')
      .filter(char => isNaN(Number(char)))
      .filter(char => char !== SPACE_CHARACTER)
      .filter(char => !SPECIAL_CHARACTERS.includes(char))
      .join('');
  }
}