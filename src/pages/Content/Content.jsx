import React, { memo, useCallback, useEffect, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import './content.styles.css';

// var transcript = new Map();
const Content = ({ videoId }) => {
  const [show, setShow] = useState(false);
  //   const [Loading, setLoading] = useState(true);

  //   if (show) {
  //     console.log('use effec start');
  //     const set = new Set();
  //     YoutubeTranscript.fetchTranscript(videoId)
  //       .then((res) => res.forEach((item) => set.add(item.text)))
  //       .catch((err) => console.log(err));
  //     transcript[videoId] = set;
  //     console.log('use effec end');
  //   }
  //   console.log(transcript[videoId]);
  //   if (transcript[videoId]) {
  //     setLoading(false);
  //   }

  return (
    <div className="wrapper">
      <img
        onClick={() => setShow(!show)}
        className="image-container"
        src="https://media.istockphoto.com/id/1010001882/vector/%C3%B0%C3%B0%C2%B5%C3%B1%C3%B0%C3%B1%C3%B1.jpg?s=612x612&w=0&k=20&c=1jeAr9KSx3sG7SKxUPR_j8WPSZq_NIKL0P-MA4F1xRw="
        alt=""
      />
    </div>
  );
};

export default memo(Content);
