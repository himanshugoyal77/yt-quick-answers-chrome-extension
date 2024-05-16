import { pipeline } from '@xenova/transformers';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import './content.styles.css';
import { HfInference } from '@huggingface/inference';

// var transcript = new Map();
const Content = ({ transcript }) => {
  const [summary, setSummary] = useState('');

  const getSummary = useCallback(async () => {
    const hf = new HfInference('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');
    const summary = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: transcript.join(' '),
      parameters: {
        max_length: 1000,
        min_length: 200,
      },
    });
    setSummary(summary.summary_text);
  }, [transcript]);

  console.log('summary', summary);

  useEffect(() => {
    getSummary();
  }, [transcript]);
  return (
    <div className="wrapper">
      <div className="content-container">
        {/* {transcript.length > 0 && (
          <div className="">
            <button onClick={getSummary}>Get Summary</button>
            <button onClick={getSummary}>Ask Questions</button>
          </div>
        )} */}
        <div className="summary">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(Content);
