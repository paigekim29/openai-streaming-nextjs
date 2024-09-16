export function parseMarkdown(markdown: string) {
  // Headings
  markdown = markdown.replace(/^###### (.*?)$/gm, '<h6>$1</h6>');
  markdown = markdown.replace(/^##### (.*?)$/gm, '<h5>$1</h5>');
  markdown = markdown.replace(/^#### (.*?)$/gm, '<h4>$1</h4>');
  markdown = markdown.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  markdown = markdown.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  markdown = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold text
  markdown = markdown.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Italic text
  markdown = markdown.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Code blocks
  markdown = markdown.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

  // Links
  markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Images
  markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');

  // Lists
  // Handle unordered lists
  markdown = markdown.replace(/(?:^\* (.*$)|^\- (.*$))/gim, '<li>$1$2</li>');
  markdown = markdown.replace(/(<li>.*<\/li>\s*)+/gim, '<ul>$&</ul>');
  markdown = markdown.replace(/<\/ul>\s*<ul>/gim, '');

  // Handle ordered lists
  markdown = markdown.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');
  markdown = markdown.replace(/(<li>.*<\/li>\s*)+/gim, '<ol>$&</ol>');
  markdown = markdown.replace(/<\/ol>\s*<ol>/gim, '');

  // Horizontal rules
  markdown = markdown.replace(/^---$/gm, '<hr>');

  // Blockquotes
  markdown = markdown.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

  // Line breaks
  markdown = markdown.replace(/\n{2,}/gim, '<br>');

  return markdown;
};
