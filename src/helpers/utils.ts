export function closeDropdownOnClick(callback: () => void) {
  const elem = document.activeElement;
  if (elem) {
    (elem as HTMLElement).blur();
  }

  callback();
}
