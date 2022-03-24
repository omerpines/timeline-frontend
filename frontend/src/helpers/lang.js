export const joinHebrew = arr => {
  if (!arr.length) return '';
  if (arr.length === 1) return arr[0];

  const head = [...arr];
  const tail = head.pop();
  return head.join(', ') + ' ' + 'ו' + tail;
};
