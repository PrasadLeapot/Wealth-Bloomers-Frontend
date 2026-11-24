import { BlocksRenderer } from "@strapi/blocks-react-renderer";

export default function BlocksContent({ content }) {
  if (!content) return null;

  return (
    <div className="rich-content">
      <BlocksRenderer content={content} />
    </div>
  );
}