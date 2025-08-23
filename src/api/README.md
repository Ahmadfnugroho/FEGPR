# Storage API Documentation

## Pengantar

Dokumentasi ini menjelaskan cara menggunakan Storage API untuk mengelola file di aplikasi GPR. Storage API memungkinkan Anda untuk mengupload, mengambil, dan menghapus file seperti gambar produk, dokumen, dan file lainnya.

## Konfigurasi

Storage API menggunakan base URL berikut:

```
https://gpr-b5n3q.sevalla.app/storage
```

Dan menggunakan header API Key yang sama dengan API utama:

```javascript
headers: {
  "X-API-KEY": "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf"
}
```

## Struktur File

Implementasi Storage API terdiri dari beberapa file:

- `constants.ts` - Menyimpan konstanta seperti API_KEY
- `storageApi.ts` - Konfigurasi instance axios dengan interceptor
- `storageService.ts` - Service untuk mengakses endpoint API
- `errorHandler.ts` - Utilitas untuk menangani error
- `storageTypes.ts` - Type definitions untuk API

## Endpoint API

### Upload File

Mengupload file ke storage.

**Endpoint:** `POST /upload`

**Parameter:**

| Nama | Tipe | Deskripsi | Wajib |
|------|------|-----------|-------|
| file | File | File yang akan diupload | Ya |
| folder | string | Folder tujuan | Tidak |
| description | string | Deskripsi file | Tidak |

**Contoh Penggunaan:**

```typescript
import StorageService from "./api/storageService";

const uploadImage = async (file: File) => {
  try {
    const response = await StorageService.uploadFile({
      file,
      folder: 'products',
      description: 'Gambar produk'
    });
    
    console.log('File berhasil diupload:', response.data.file.url);
    return response.data.file.url;
  } catch (error) {
    console.error('Gagal mengupload file:', error);
    return null;
  }
};
```

### Mendapatkan Daftar File

Mendapatkan daftar file dari storage.

**Endpoint:** `GET /files`

**Parameter:**

| Nama | Tipe | Deskripsi | Wajib |
|------|------|-----------|-------|
| page | number | Nomor halaman | Tidak |
| per_page | number | Jumlah item per halaman | Tidak |
| search | string | Kata kunci pencarian | Tidak |
| mime_type | string | Filter berdasarkan tipe MIME | Tidak |

**Contoh Penggunaan:**

```typescript
import StorageService from "./api/storageService";

const getImages = async () => {
  try {
    const response = await StorageService.getFiles({
      page: 1,
      per_page: 10,
      mime_type: 'image'
    });
    
    console.log('Daftar file:', response.data.files);
    return response.data.files;
  } catch (error) {
    console.error('Gagal mendapatkan daftar file:', error);
    return [];
  }
};
```

### Mendapatkan Detail File

Mendapatkan detail file berdasarkan ID.

**Endpoint:** `GET /files/{fileId}`

**Parameter:**

| Nama | Tipe | Deskripsi | Wajib |
|------|------|-----------|-------|
| fileId | string | ID file | Ya |

**Contoh Penggunaan:**

```typescript
import StorageService from "./api/storageService";

const getFileDetail = async (fileId: string) => {
  try {
    const response = await StorageService.getFileById(fileId);
    console.log('Detail file:', response.data.file);
    return response.data.file;
  } catch (error) {
    console.error('Gagal mendapatkan detail file:', error);
    return null;
  }
};
```

### Menghapus File

Menghapus file berdasarkan ID.

**Endpoint:** `DELETE /files/{fileId}`

**Parameter:**

| Nama | Tipe | Deskripsi | Wajib |
|------|------|-----------|-------|
| fileId | string | ID file | Ya |

**Contoh Penggunaan:**

```typescript
import StorageService from "./api/storageService";

const deleteFile = async (fileId: string) => {
  try {
    const response = await StorageService.deleteFile(fileId);
    console.log('File berhasil dihapus:', response.message);
    return true;
  } catch (error) {
    console.error('Gagal menghapus file:', error);
    return false;
  }
};
```

## Penanganan Error

Storage API menyediakan utilitas untuk menangani error dengan lebih baik.

```typescript
import { handleApiError, formatValidationErrors } from "./api/errorHandler";

try {
  // Panggil API
} catch (error) {
  const { message, details, statusCode } = handleApiError(error);
  
  console.error(`Error (${statusCode}): ${message}`);
  
  // Jika ada error validasi
  if (details && typeof details !== 'string') {
    const formattedErrors = formatValidationErrors(details);
    console.error('Validation errors:', formattedErrors);
  }
}
```

## Type Definitions

Storage API menyediakan type definitions untuk memudahkan penggunaan dengan TypeScript.

```typescript
import { StorageFile, UploadFileParams } from "./types/storageTypes";

// Contoh penggunaan type
const handleFile = (file: StorageFile) => {
  console.log(`File: ${file.name}, URL: ${file.url}`);
};

const uploadParams: UploadFileParams = {
  file: new File([], 'test.jpg'),
  folder: 'products'
};
```

## Contoh Implementasi

Untuk contoh implementasi lebih lanjut, lihat file `storageApiExample.ts` yang berisi contoh-contoh penggunaan Storage API dalam berbagai skenario.