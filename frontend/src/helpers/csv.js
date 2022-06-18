const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O',  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const alphabetLength = alphabet.length;

export const indexToLetter = i => {
  if (Number.isNaN(i)) throw new Error('index is NaN');
  if (i < 0) return '';
  if (i < alphabetLength) return alphabet[i];
  const remain = i % alphabetLength;
  return indexToLetter(Math.floor((i - remain) / alphabetLength) - 1) + alphabet[remain]; 
}

export const coordsToExcel = (x, y) => `${indexToLetter(x)}${y + 2}`;
