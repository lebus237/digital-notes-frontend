import { axios } from '#/infra/http'
import type { DocumentFile } from '#/types'
import { DocumentContentType } from '#/types'

function triggerDownload(blob: Blob, filename: string): void {
   const url = URL.createObjectURL(blob)
   const link = document.createElement('a')
   link.href = url
   link.download = filename
   document.body.appendChild(link)
   link.click()

   setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(link)
   }, 10_000)
}

const downloadFromArrayBuffer = (
   arrayBuffer: ArrayBuffer,
   type: DocumentFile,
   filename: string,
): void => {
   const blob = new Blob([arrayBuffer], { type: DocumentContentType[type] })
   triggerDownload(blob, filename)
}

// const downloadFromBlob = (blob: Blob, filename: string): void => {
//    triggerDownload(blob, filename)
// }

export const downloadDocumentFile = async (
   fileUrl: string,
   filename: string,
   type: DocumentFile,
): Promise<any> => {
   try {
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })
      downloadFromArrayBuffer(response.data, type, filename)
   } catch {
      return { message: 'Echec de téléchargement du document' }
   }
}
