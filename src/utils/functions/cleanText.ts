export function cleanText(text: string): string {
    return text.replaceAll(/https?:\/\/[^\s]+/g, '')
        .replaceAll(/\n\nDiscord \[.*?\]\|X \[.*?\]\|Facebook \[.*?\]\|Instagram \[.*?\]\|TikTok \[.*?\]\|YouTube \[.*?\]\|Twitch \[.*?\]\n\n/g, '')
        .replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡-]/g, '')
        .replaceAll(/\s+/g, ' ').trim()
        .replaceAll(/\s+([.,;:!?¿¡-])/g, '$1')
        .replaceAll(/([.,;:!?¿¡-])\s+/g, '$1');
}
