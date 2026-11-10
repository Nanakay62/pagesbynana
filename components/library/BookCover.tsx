'use client';

import React, { useState } from 'react';

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
  const [imgError, setImgError] = useState(false);

  const isImage = Boolean(
    !imgError &&
      coverStyle &&
      (coverStyle.startsWith('/') ||
        coverStyle.startsWith('http://') ||
        coverStyle.startsWith('https://') ||
        coverStyle.startsWith('data:') ||
        /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(coverStyle))
  );

  if (isImage) {
    return (
      <div
        className={`book-cover-image ${className}`}
        aria-label={`Cover for ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverStyle}
          alt={`Cover for ${title}`}
          loading="lazy"
          className="w-full h-full object-cover block"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const fallbackStyle =
    coverStyle && ['cover-a', 'cover-b', 'cover-c', 'cover-d'].includes(coverStyle)
      ? coverStyle
      : 'cover-a';

  return (
    <div className={`book-cover ${fallbackStyle} ${className}`} aria-hidden="true">
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
