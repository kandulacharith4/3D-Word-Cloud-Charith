import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import WordCloud from './WordCloud';
import { WordData } from '../types';

interface SceneProps {
  words: WordData[];
}

const Scene = ({ words }: SceneProps) => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Background stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      {/* Word cloud */}
      {words.length > 0 && <WordCloud words={words} />}
    </Canvas>
  );
};

export default Scene;
