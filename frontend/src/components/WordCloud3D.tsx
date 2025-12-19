/* eslint-disable react-hooks/purity */
import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { WordItem } from "../api";

type PositionedWord = WordItem & {
  position: [number, number, number];
  color: string;
};

type WordProps = {
  word: string;
  weight: number;
  position: [number, number, number];
  color: string;
};

function Word({ word, weight, position, color }: WordProps) {
  return (
    <Text position={position} fontSize={0.4 + weight * 3} color={color}>
      {word}
    </Text>
  );
}

export default function WordCloud3D({ words }: { words: WordItem[] }) {
 
  const layoutRef = useRef<PositionedWord[] | null>(null);

  if (!layoutRef.current) {
    layoutRef.current = words.map((w) => ({
      ...w,
      position: [
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      ],
      
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    }));
  }

  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight />
      <OrbitControls />

      {layoutRef.current.map((w, i) => (
        <Word
          key={i}
          word={w.word}
          weight={w.weight}
          position={w.position}
          color={w.color}
        />
      ))}
    </Canvas>
  );
}
