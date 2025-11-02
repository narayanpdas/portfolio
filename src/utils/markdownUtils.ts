interface FrontMatter {
  [key: string]: any;
}

export function parseFrontMatter(markdown: string): { data: FrontMatter; content: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const matches = markdown.match(frontMatterRegex);

  if (!matches) {
    return {
      data: {},
      content: markdown
    };
  }

  const frontMatter = matches[1];
  const content = matches[2];

  // Parse the front matter
  const data: FrontMatter = {};
  const lines = frontMatter.split('\n');
  
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      const trimmedKey = key.trim();
      // Special handling for tags
      if (trimmedKey === 'tags') {
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            // Parse JSON array
            data.tags = JSON.parse(value.replace(/'/g, '"'));
          } catch {
            // If JSON parsing fails, try splitting by commas
            const tagsString = value.slice(1, -1).trim();
            data.tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
          }
        } else {
          // Single tag or empty
          data.tags = value ? [value.trim()] : [];
        }
      }
      // Parse other arrays
      else if (value.startsWith('[') && value.endsWith(']')) {
        try {
          data[trimmedKey] = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          data[trimmedKey] = value;
        }
      } else {
        data[trimmedKey] = value;
      }
    }
  });

  return {
    data,
    content: content.trim()
  };
}