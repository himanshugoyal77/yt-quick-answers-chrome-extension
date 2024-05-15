import { memo, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';

const Transcript = ({ videoId }) => {
  return <div className="content-container">{videoId}</div>;
};

export default memo(Transcript);
