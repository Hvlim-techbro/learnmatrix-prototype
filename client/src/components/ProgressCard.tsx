import React from 'react';

const ProgressCard = ({ title, children }) => {
  return (
    <div className="glass-light hover-lift rounded-2xl p-6 border border-border/30">
      <h3 className="text-lg font-semibold mb-4 text-foreground/90">{title}</h3>
      {children}
    </div>
  );
};

export default ProgressCard;