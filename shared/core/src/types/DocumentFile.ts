import { IconFileTypeCsv, IconFileTypePdf, IconFileTypeXls } from '@tabler/icons-react'

export enum DocumentFile {
   Pdf = 'pdf',
   Excel = 'excel',
   Csv = 'csv',
   // Word = 'word',
   // Txt = 'text',
}

export type DocumentExtension = 'pdf' | 'xlsx' | 'csv'

export const DocumentContentType: Record<DocumentFile, string> = {
   [DocumentFile.Pdf]: 'application/pdf',
   [DocumentFile.Excel]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   [DocumentFile.Csv]: 'text/csv',
   // [DocumentFile.Word]: 'application/msword',
   // [DocumentFile.Txt]: 'text/plain',
}

export const DocumentFileExtension: Record<DocumentFile, DocumentExtension> = {
   [DocumentFile.Pdf]: 'pdf',
   [DocumentFile.Excel]: 'xlsx',
   [DocumentFile.Csv]: 'csv',
   // [DocumentFile.Word]: 'docx',
   // [DocumentFile.Txt]: 'txt',
}

export const documentFileThumbnail: Record<DocumentFile, any> = {
   [DocumentFile.Pdf]: IconFileTypePdf,
   [DocumentFile.Excel]: IconFileTypeXls,
   [DocumentFile.Csv]: IconFileTypeCsv,
   // [DocumentFile.Word]: IconFileTypeDocx,
   // [DocumentFile.Txt]: <IconFileTypeTxt />,
}

export const DocumentFileFromExtension: Record<DocumentExtension, DocumentFile> = {
   pdf: DocumentFile.Pdf,
   xlsx: DocumentFile.Excel,
   csv: DocumentFile.Csv,
}
