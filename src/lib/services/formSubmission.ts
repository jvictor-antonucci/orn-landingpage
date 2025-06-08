// Frontend service for form submission via API
export interface FormData {
  name: string;
  email: string;
  height: string;
  photos: File[];
}

export interface SubmissionResult {
  success: boolean;
  error?: string;
  id?: string;
  message?: string;
}

// Convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export async function submitForm(formData: FormData): Promise<SubmissionResult> {
  try {
    // Convert photos to base64
    const photosWithData = await Promise.all(
      formData.photos.map(async (photo) => ({
        name: photo.name,
        type: photo.type,
        data: await fileToBase64(photo)
      }))
    );

    // Prepare data for API
    const submissionData = {
      name: formData.name,
      email: formData.email,
      height: formData.height,
      photos: photosWithData
    };

    // Send to API
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return {
        success: true,
        id: result.id,
        message: result.message
      };
    } else {
      return {
        success: false,
        error: result.error || 'Erro ao enviar formulário'
      };
    }

  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      error: 'Erro de conexão. Tente novamente.'
    };
  }
}