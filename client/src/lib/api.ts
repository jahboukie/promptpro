import { PromptData } from '../components/PromptEditor';

export interface ApiResponse {
  content: string;
  model: string;
  promptId: number | null;
}

export interface ApiError {
  error: string;
}

export async function generateResponse(promptData: PromptData): Promise<ApiResponse> {
  const response = await fetch('http://localhost:5000/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to generate response');
  }

  return response.json();
}

export async function savePrompt(promptData: PromptData): Promise<any> {
  const response = await fetch('http://localhost:5000/api/prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to save prompt');
  }

  return response.json();
}

export async function getPrompts(): Promise<any[]> {
  const response = await fetch('http://localhost:5000/api/prompts');

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch prompts');
  }

  return response.json();
}

export async function getPrompt(id: number): Promise<any> {
  const response = await fetch(`http://localhost:5000/api/prompts/${id}`);

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch prompt');
  }

  return response.json();
}

export async function updatePrompt(id: number, promptData: Partial<PromptData>): Promise<any> {
  const response = await fetch(`http://localhost:5000/api/prompts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(promptData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to update prompt');
  }

  return response.json();
}

export async function deletePrompt(id: number): Promise<{ success: boolean }> {
  const response = await fetch(`http://localhost:5000/api/prompts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to delete prompt');
  }

  return response.json();
}

export async function getCategories(): Promise<any[]> {
  const response = await fetch('http://localhost:5000/api/categories');

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch categories');
  }

  return response.json();
}

export async function createCategory(name: string, icon: string): Promise<any> {
  const response = await fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, icon, userId: 1 }), // Using demo user ID
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || 'Failed to create category');
  }

  return response.json();
}
