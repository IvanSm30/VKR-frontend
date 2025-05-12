export interface FileData {
    id: number | undefined,
    file_path: string,
    labels: object | null,
    content_type: string,
    keywords: object | null
    title: string,
}