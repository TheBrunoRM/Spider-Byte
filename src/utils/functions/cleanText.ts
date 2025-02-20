export function cleanText(text: string): string {
    const URL_PATTERN = /https?:\/\/[^\s]+/g;
    const SOCIAL_MEDIA_LINKS = /\n\nDiscord \[.*?\]\|X \[.*?\]\|Facebook \[.*?\]\|Instagram \[.*?\]\|TikTok \[.*?\]\|YouTube \[.*?\]\|Twitch \[.*?\]\n\n/g;
    const SOCIAL_MEDIA_WORDS = /\b(Discord|Facebook|Instagram|TikTok|YouTube|Twitch|X)\b/g;
    const ALLOWED_CHARS = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡-]/g;
    const MULTIPLE_SPACES = /\s+/g;
    const MULTIPLE_NEWLINES = /\n{3,}/g;
    const MULTIPLE_PUNCTUATION = /([.,!?]){2,}/g;
    const SPACE_BEFORE_PUNCT = /\s+([.,;:!?¿¡])/g;
    const SPACE_AFTER_PUNCT = /([.,;:!?¿¡])(?=\S)/g;
    const REPEATED_COLONS = /(:+\s*)+UTC/gi;
    const STANDALONE_COLONS = /:\s*:/g;
    const UTC_PATTERN = /,\s*,\s*at\s+UTC/gi;
    const UTC_CLEANUP = /\s+UTC/gi;

    return text
        .replace(URL_PATTERN, '')
        .replace(SOCIAL_MEDIA_LINKS, '')
        .replace(SOCIAL_MEDIA_WORDS, '')
        .replace(ALLOWED_CHARS, '')
        .replace(MULTIPLE_SPACES, ' ')
        .replace(MULTIPLE_NEWLINES, '\n\n')
        .replace(MULTIPLE_PUNCTUATION, '$1')
        .replace(REPEATED_COLONS, ' UTC')
        .replace(STANDALONE_COLONS, ':')
        .replace(UTC_PATTERN, ' UTC')
        .replace(UTC_CLEANUP, ' UTC')
        .trim()
        .replace(SPACE_BEFORE_PUNCT, '$1')
        .replace(SPACE_AFTER_PUNCT, '$1 ')
        .split('. ')
        .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase())
        .join('. ');
}
