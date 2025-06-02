export interface FileData {
    id: number;
    file_path: string;
    labels: { "По назначению": string[], "По типу": string };
    content_type: string;
    title: string;
    date_created: string;
    file_path_convert_pdf: string;
    user_id?: number
}
