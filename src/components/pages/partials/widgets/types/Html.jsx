import React from 'react';

export default function Html({ step }) {
  return <div dangerouslySetInnerHTML={{__html: step.body}} />;
}
