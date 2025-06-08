import { json } from '@sveltejs/kit';
import { google } from 'googleapis';
import type { RequestHandler } from './$types';
import { Readable } from 'stream';
import { env } from '$env/dynamic/private';

const SPREADSHEET_ID = env.SPREADSHEET_ID || '1ieFdQydTz-pYDpDpl9xfFcZQP9KJVUJtbr3-Pk21YOo';
const FOLDER_NAME = 'Kibbe Analysis Photos';

interface FormSubmissionData {
  name: string;
  email: string;
  height: string;
  photos: { name: string; type: string; data: string }[];
}

async function authenticate() {
  try {
    // Use environment variables for credentials
    const credentials = {
      type: 'service_account',
      project_id: env.GOOGLE_PROJECT_ID,
      private_key_id: env.GOOGLE_PRIVATE_KEY_ID,
      private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: env.GOOGLE_CLIENT_EMAIL,
      client_id: env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(env.GOOGLE_CLIENT_EMAIL || '')}`,
      universe_domain: 'googleapis.com'
    };
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
    });

    const authClient = await auth.getClient();
    
    const sheets = google.sheets({ version: 'v4', auth: auth });
    const drive = google.drive({ version: 'v3', auth: auth });
    
    return { sheets, drive, auth };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Failed to authenticate with Google APIs');
  }
}

async function createOrFindDriveFolder(drive: any): Promise<string> {
  try {
    // Check if folder already exists
    const existingFolders = await drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
      spaces: 'drive'
    });

    if (existingFolders.data.files && existingFolders.data.files.length > 0) {
      return existingFolders.data.files[0].id!;
    }

    // Create new folder
    const folderMetadata = {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });

    return folder.data.id!;
  } catch (error) {
    console.error('Error creating/finding folder:', error);
    throw new Error('Failed to create Drive folder');
  }
}

async function uploadPhotoToDrive(drive: any, folderId: string, photo: { name: string; type: string; data: string }, fileName: string): Promise<string> {
  try {
    // Convert base64 to Buffer
    const base64Data = photo.data.split(',')[1]; // Remove data:image/jpeg;base64, prefix
    const buffer = Buffer.from(base64Data, 'base64');

    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const media = {
      mimeType: photo.type,
      body: stream
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    });

    // Make file publicly viewable
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return response.data.webViewLink || '';
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo to Drive');
  }
}

function generateId(): string {
  const now = new Date();
  const timestamp = now.getTime();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomSuffix}`;
}

function formatDateTime(): string {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData: FormSubmissionData = await request.json();
    
    // Authenticate with Google APIs
    const { sheets, drive } = await authenticate();
    
    // Create or find Drive folder
    const folderId = await createOrFindDriveFolder(drive);
    
    // Generate unique ID
    const submissionId = generateId();
    
    // Upload photos to Drive
    const photoLinks: string[] = [];
    for (let i = 0; i < formData.photos.length; i++) {
      const photo = formData.photos[i];
      const fileName = `${submissionId}_photo_${i + 1}_${photo.name}`;
      const link = await uploadPhotoToDrive(drive, folderId, photo, fileName);
      if (link) {
        photoLinks.push(link);
      }
    }
    
    // Prepare data for Google Sheets
    const values = [
      [
        submissionId,
        formatDateTime(),
        formData.name,
        formData.email,
        formData.height,
        formData.photos.length,
        photoLinks.join('\n'),
        'Em progresso'
      ]
    ];
    
    // Add row to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Página1!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: values
      }
    });
    
    return json({ 
      success: true, 
      id: submissionId,
      message: 'Formulário enviado com sucesso!'
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
};