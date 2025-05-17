export interface FileData {
    id?: number;
    file_path: string;
    labels: Record<string, any> | null;
    content_type: string;
    keywords: Record<string, any> | null;
    title: string;
    date_created: string;
}
