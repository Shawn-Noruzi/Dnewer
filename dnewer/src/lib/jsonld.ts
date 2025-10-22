export function BlogPostingJsonLd({
    headline,
    description,
    datePublished,
    url,
}: {
    headline?: string;
    description?: string;
    datePublished?: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline,
        description,
        datePublished,
        mainEntityOfPage: url,
    };
}