import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

const BASE_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

interface ExerciseImageProps {
  exerciseId: string;
}

export function ExerciseImage({ exerciseId }: ExerciseImageProps) {
  const [error0, setError0] = useState(false);
  const [error1, setError1] = useState(false);

  const url0 = `${BASE_URL}${exerciseId}/0.jpg`;
  const url1 = `${BASE_URL}${exerciseId}/1.jpg`;

  return (
    <div className="flex gap-3">
      {/* Image 0 */}
      <div className="flex-1 aspect-[4/3] rounded-lg overflow-hidden bg-bg-tertiary">
        {error0 ? (
          <div className="flex items-center justify-center w-full h-full text-text-muted">
            <Dumbbell size={32} />
          </div>
        ) : (
          <img
            src={url0}
            alt={`${exerciseId} position 1`}
            className="w-full h-full object-cover"
            onError={() => setError0(true)}
          />
        )}
      </div>

      {/* Image 1 */}
      <div className="flex-1 aspect-[4/3] rounded-lg overflow-hidden bg-bg-tertiary">
        {error1 ? (
          <div className="flex items-center justify-center w-full h-full text-text-muted">
            <Dumbbell size={32} />
          </div>
        ) : (
          <img
            src={url1}
            alt={`${exerciseId} position 2`}
            className="w-full h-full object-cover"
            onError={() => setError1(true)}
          />
        )}
      </div>
    </div>
  );
}
