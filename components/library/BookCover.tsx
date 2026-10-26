import React from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  coverStyle?: string;
  className?: string;
}

export default function BookCover({
  title,
  author = 'Nana Kwame Dickson',
  coverStyle = 'cover-a',
  className = '',
}: BookCoverProps) {
  return (
    <div className={`book-cover ${coverStyle} ${className}`} aria-hidden="true">
      <div className="cover-inner">
        <div className="cover-author">{author}</div>
        <div className="mt-auto">
          <div className="cover-ornament"></div>
          <div className="cover-title">{title}</div>
        </div>
      </div>
    </div>
  );
}
