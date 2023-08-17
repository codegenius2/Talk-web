export interface Message {
    id: string;
    role: 'user' | 'assistant';
    replyToId?: string
    text?: MText
    audio?: MAudio
    whoIsOnTheTop: 'text' | 'audio' // 🤣
    createdAt: number
}

export interface MText {
    text: string
    status: 'pending' | 'receiving' | 'done' | 'error'
    errorMessage?: string // only valid if status==='error'
    createdAt: number
}

export interface MAudio {
    audioUrl?: string
    status: 'pending' | 'done' | 'error'
    errorMessage?: string // only valid if status==='error'
    createdAt: number
}