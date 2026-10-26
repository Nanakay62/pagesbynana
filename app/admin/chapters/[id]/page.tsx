'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import TipTapEditor from '@/components/admin/TipTapEditor';

function ChapterEditorContent() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <TipTapEditor
      initialTitle="The Flickering"
      initialContent="<p>The first lantern to fail was the one on Sable Street, and nobody noticed for three days. It simply went out on a Tuesday, quietly, the way old things do when they have been tired for a long time. By the time Maren walked past it on her way to the bakery, the glass was already cold, and the little curl of smoke that used to live inside it had gone somewhere else entirely.</p><p>She stopped, because stopping was what keepers did, and she had been a keeper now for eleven days — though she still did not quite believe it.</p><div class=&quot;scene-break&quot;></div><p>She climbed the three iron steps of the post the way her grandmother had taught her, one hand on the cold rail, the other holding the oilskin bag of wicks.</p>"
      initialStatus="published"
      bookSlug="the-lantern-keeper"
      chapterSlug="the-flickering"
    />
  );
}

export default function ChapterEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-[var(--muted)]">Loading TipTap editor...</div>}>
      <ChapterEditorContent />
    </Suspense>
  );
}
