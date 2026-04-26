import { type JSX } from 'react';
import { StepIntro } from './StepIntro.js';
import { StepVocab } from './StepVocab.js';
import { StepSentence } from './StepSentence.js';
import { StepPinyin } from './StepPinyin.js';
import { StepListen } from './StepListen.js';
import { StepSpeak } from './StepSpeak.js';
import { StepRead } from './StepRead.js';
import { StepWrite } from './StepWrite.js';
import { StepPractice } from './StepPractice.js';
import { StepQuiz } from './StepQuiz.js';
import { StepP1 } from './StepP1.js';
import { StepP2 } from './StepP2.js';
import { StepP3 } from './StepP3.js';
import { type StepResult } from './types.js';

export interface StepHostProps {
  type: string;
  payload: Record<string, unknown>;
  title?: Record<string, string>;
  lang?: string;
  onComplete: (r: StepResult) => void;
}

export function StepHost({ type, payload, title, lang, onComplete }: StepHostProps): JSX.Element {
  const props = { payload: payload as never, title, lang, onComplete };
  switch (type) {
    case 'intro': return <StepIntro {...props} />;
    case 'word':
    case 'vocab': return <StepVocab {...props} />;
    case 'sentence': return <StepSentence {...props} />;
    case 'pinyin': return <StepPinyin {...props} />;
    case 'listen': return <StepListen {...props} />;
    case 'speak': return <StepSpeak {...props} />;
    case 'read': return <StepRead {...props} />;
    case 'write': return <StepWrite {...props} />;
    case 'practice': return <StepPractice {...props} />;
    case 'quiz': return <StepQuiz {...props} />;
    case 'p1': return <StepP1 {...props} />;
    case 'p2': return <StepP2 {...props} />;
    case 'p3': return <StepP3 {...props} />;
    default:
      return (
        <div className="text-center text-text-secondary p-4" data-testid="step-unknown">
          Unknown step type: {type}
        </div>
      );
  }
}
