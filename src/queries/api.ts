export const createAssistant = async (): Promise<{ assistantId: string } | null> => {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create assistant: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating assistant:', error);
    return null;
  }
};

export const createThread = async (): Promise<{ threadId: string } | null> => {
  try {
    const response = await fetch('/api/thread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create thread: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating thread:', error);
    return null;
  }
};
