import { Helmet, HelmetProvider } from 'react-helmet-async';

export interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    canonical?: string;
    language?: string;
    children?: React.ReactNode;
}

export const SEO = ({
    title = 'MiniMax Games',
    description = 'Play a variety of mini-games including Tic-Tac-Toe and more',
    keywords = ['games', 'mini-games', 'tic-tac-toe', 'puzzle', 'brain games'],
    ogTitle,
    ogDescription,
    ogImage = '/og-image.jpg',
    ogUrl,
    canonical,
    language = 'en',
    children,
}: SEOProps) => {
    const metaTitle = title;
    const metaDescription = description;
    const metaKeywords = keywords.join(', ');
    const metaOgTitle = ogTitle || title;
    const metaOgDescription = ogDescription || description;

    return (
        <>
            <Helmet>
                {/* Basic metadata */}
                <html lang={language} />
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />

                {/* Canonical URL */}
                {canonical && <link rel="canonical" href={canonical} />}

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={metaOgTitle} />
                <meta property="og:description" content={metaOgDescription} />
                {ogImage && <meta property="og:image" content={ogImage} />}
                {ogUrl && <meta property="og:url" content={ogUrl} />}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaOgTitle} />
                <meta name="twitter:description" content={metaOgDescription} />
                {ogImage && <meta name="twitter:image" content={ogImage} />}

                {/* Additional metadata */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Helmet>
            {children}
        </>
    );
};

export const SEOProvider = ({ children }: { children: React.ReactNode }) => {
    return <HelmetProvider>{children}</HelmetProvider>;
};

export default SEO;
