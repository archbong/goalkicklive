interface VideoPlayerProps {
  embedHtml: string;
}

export default function VideoPlayer({ embedHtml }: VideoPlayerProps) {
  return (
    <div
      className="w-full aspect-video bg-black overflow-hidden rounded-lg"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
}
