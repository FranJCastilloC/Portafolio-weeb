import React from 'react';

const WorkItem = ({ data }) => {
  return (
    <div className={`${data.class} ${data.bgClass}`}>
      <div className="work-content">
        <h3>{data.title}</h3>
        <p>{data.subtitle}</p>
        {/* Render video if videoSrc is available, otherwise render image */}
        {data.videoSrc ? (
          <video controls style={{ width: '100%', height: 'auto' }}>
            <source src={data.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={data.imgSrc} alt={data.title} style={{ width: '100%', height: 'auto' }} />
        )}
      </div>
    </div>
  );
};

export default WorkItem;

import React from 'react';
import ReactDOM from 'react-dom';
import WorkItem from './WorkItem'; // Ajusta la ruta de importación según sea necesario

const App = () => {
  return (
    <div>
      <WorkItem data={data} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
