import { useEffect, useState } from 'react';

export function useTypewriter(phrases: string[], speed = 30, pause = 1200) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!phrases.length) return;
    setDisplayed('');
    setChar(0);
    setIndex(0);
  }, [phrases.join('|')]);

  useEffect(() => {
    if (!phrases.length) return;
    if (char < phrases[index].length) {
      const timeout = setTimeout(() => {
        setDisplayed(phrases[index].slice(0, char + 1));
        setChar(char + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIndex((index + 1) % phrases.length);
        setChar(0);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [char, index, phrases, speed, pause]);

  return displayed;
}
