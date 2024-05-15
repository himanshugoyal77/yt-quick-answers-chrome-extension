import { pipeline } from '@xenova/transformers';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import './content.styles.css';
import { HfInference } from '@huggingface/inference';

// var transcript = new Map();
const Content = ({ videoId }) => {
  const [transcript, setTranscript] = useState([]);
  const [summary, setSummary] = useState('');

  const getTranscript = useCallback(async () => {
    YoutubeTranscript.fetchTranscript(videoId)
      .then((res) =>
        res.forEach((item) => setTranscript((prev) => [...prev, item.text]))
      )
      .catch((err) => console.log(err));
  }, [videoId]);

  const getSummary = useCallback(async () => {
    // console.log(transcript.join(' '));
    // const response = await fetch(
    //   'https://api-inference.huggingface.co/models/Falconsai/text_summarization',
    //   {
    //     headers: {
    //       Authorization: 'Bearer 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',
    //     },
    //     method: 'POST',
    //     body: JSON.stringify(transcript.join(' ')),
    //   }
    // );
    // const result = await response.json();
    // console.log(result);
    // setSummary(result[0].summary_text);
    //return result;
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

  useEffect(() => {
    getTranscript();
  }, [videoId]);

  return (
    <div className="wrapper">
      <div className="content-container">
        {transcript.length > 0 && (
          <button onClick={getSummary}>Get Summary</button>
        )}
        <div className="summary">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(Content);
