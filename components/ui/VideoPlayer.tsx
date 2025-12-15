import DOMPurify from "dompurify";

interface VideoPlayerProps {
  embedHtml: string;
}

export default function VideoPlayer({ embedHtml }: VideoPlayerProps) {
  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(embedHtml, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    ALLOWED_URI_REGEXP:
      /^(https?:)?\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|scorebat\.com|www\.scorebat\.com|cdn\.scorebat\.com)/i,
  });

  return (
    <div
      className="w-full aspect-video bg-black overflow-hidden rounded-lg"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
