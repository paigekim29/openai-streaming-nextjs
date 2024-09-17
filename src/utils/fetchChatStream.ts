export default async function sendMessageToAPI(message: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get reader from response body');
  }

  return reader;
}
