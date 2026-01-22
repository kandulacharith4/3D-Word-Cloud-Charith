import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { WordData } from '../types';

interface WordCloudProps {
  words: WordData[];
}

const WordCloud = ({ words }: WordCloudProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate positions in a sphere
  const wordObjects = useMemo(() => {
    if (words.length === 0) return [];
    
    const radius = 8;
    const count = words.length;
    
    return words.map((wordData, index) => {
      // Distribute points on a sphere using golden angle spiral
      const theta = count > 1 ? Math.acos(1 - (2 * index) / count) : 0;
      const phi = Math.PI * (1 + Math.sqrt(5)) * index;
      
      const x = radius * Math.cos(phi) * Math.sin(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(theta);
      
      // Normalize weight to font size (between 0.3 and 1.5)
      const fontSize = 0.3 + (wordData.weight * 1.2);
      
      // Color based on weight (lighter = more important)
      const hue = 0.6 + (wordData.weight * 0.3); // Blue to purple gradient
      const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
      
      return {
        ...wordData,
        position: [x, y, z] as [number, number, number],
        fontSize,
        color: `#${color.getHexString()}`,
      };
    });
  }, [words]);

  // Rotate the entire cloud
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {wordObjects.map((wordObj, index) => (
        <Word
          key={`${wordObj.word}-${index}`}
          word={wordObj.word}
          position={wordObj.position}
          fontSize={wordObj.fontSize}
          color={wordObj.color}
        />
      ))}
    </group>
  );
};

interface WordProps {
  word: string;
  position: [number, number, number];
  fontSize: number;
  color: string;
}

const Word = ({ word, position, fontSize, color }: WordProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Individual word animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      {word}
    </Text>
  );
};

export default WordCloud;
