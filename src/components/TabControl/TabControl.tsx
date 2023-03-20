import React, { useState } from 'react';
import './TabControl.scss';

type Tab = {
  label: string;
  content: string;
};

type Props = {
  tabs: Tab[];
};

const TabControl: React.FC<Props> = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tab-control">
    <ul className="tab-headers">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default TabControl;
