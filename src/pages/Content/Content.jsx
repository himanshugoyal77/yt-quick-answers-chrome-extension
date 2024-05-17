import { pipeline } from '@xenova/transformers';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import './content.styles.css';
import { HfInference } from '@huggingface/inference';
import { Bars } from 'react-loader-spinner';
import { load } from 'langchain/load';

// var transcript = new Map();
const Content = ({ transcript }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const getSummary = useCallback(async () => {
    setLoading(true);
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
    setLoading(false);
  }, [transcript]);

  console.log('summary', summary);

  useEffect(() => {
    getSummary();
  }, [transcript]);

  function replaceHtmlEntities(text) {
    for (const [entity, char] of Object.entries(html_entities)) {
      text = text.replaceAll(entity, char);
    }
    console.log('text', text);
    return text;
  }

  if (loading) {
    return (
      <div className="spinner">
        <Bars
          height="30"
          width="30"
          color="#00ACEE"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        <p className="spinner-text">
          generating summary, <br /> Please Wait ...
        </p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="content-container">
        <div className="summary">
          <p>{replaceHtmlEntities(summary)}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(Content);

const html_entities = {
  '&quot;': '"',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&nbsp;': ' ',
  '&cent;': '¢',
  '&pound;': '£',
  '&yen;': '¥',
  '&euro;': '€',
  '&copy;': '©',
  '&reg;': '®',
  '&sect;': '§',
  '&uml;': '¨',
  '&deg;': '°',
  '&plusmn;': '±',
  '&para;': '¶',
  '&middot;': '·',
  '&sup1;': '¹',
  '&sup2;': '²',
  '&sup3;': '³',
  '&frac14;': '¼',
  '&frac12;': '½',
  '&frac34;': '¾',
  '&times;': '×',
  '&divide;': '÷',
  '&amp;#39;': "'",
  '&#39;': "'",
  '&amp##38;re': ' are',
};
