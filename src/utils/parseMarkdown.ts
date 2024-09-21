export default function parseMarkdown(markdown: string) {
  const codeBlocks: string[] = [];

  // Escape HTML tags to prevent rendering
  markdown = markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  markdown = markdown.replace(/```([\s\S]*?)```/gim, (match, p1) => {
    codeBlocks.push(match);
    return `CODEBLOCK${codeBlocks.length - 1}CODEBLOCK`;
  });

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

  // Inline code
  markdown = markdown.replace(/`([\s\S]*?)`/gim, (match, p1) => {
    return `<code>${p1}</code>`;
  });

  // Links
  markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Images
  markdown = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1">');

  // Lists
  markdown = markdown.replace(/(?:^\* (.*$)|^\- (.*$))/gim, '<li>$1$2</li>');
  markdown = markdown.replace(/(<li>.*<\/li>\s*)+/gim, '<ul>$&</ul>');
  markdown = markdown.replace(/<\/ul>\s*<ul>/gim, '');

  // Horizontal rules
  markdown = markdown.replace(/^---$/gm, '<hr>');

  // Blockquotes
  markdown = markdown.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');

  // Restore code blocks with original content
  markdown = markdown.replace(/CODEBLOCK(\d+)CODEBLOCK/gim, (match, p1) => {
    return `<pre><code>${codeBlocks[parseInt(p1)].replace(/```/g, '')}</code></pre>`;
  });

  return markdown;
}
