export function cleanText(text: string): string {
    text = text.replace(/https?:\/\/[^\s]+/g, '');

    text = text.replace(/\n\nDiscord \[.*?\]\|X \[.*?\]\|Facebook \[.*?\]\|Instagram \[.*?\]\|TikTok \[.*?\]\|YouTube \[.*?\]\|Twitch \[.*?\]\n\n/g, '');

    text = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡-]/g, '');

    text = text.replace(/\s+/g, ' ').trim();

    text = text.replace(/\s+([.,;:!?¿¡-])/g, '$1');
    text = text.replace(/([.,;:!?¿¡-])\s+/g, '$1');

    return text;
}
