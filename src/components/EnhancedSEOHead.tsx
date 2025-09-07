import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  price?: number;
  url?: string;
  type?: 'website' | 'product' | 'article';
  category?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

const EnhancedSEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = "rental kamera, sewa kamera, rental fotografi, sewa DSLR, rental mirrorless",
  image = "/og-default.jpg",
  price,
  url = window.location.href,
  type = 'website',
  category,
  brand,
  availability = 'InStock'
}) => {
  const siteName = "Global Photo Rental";
  const fullTitle = `${title} | ${siteName}`;
  
  // Generate structured data based on type
  const generateStructuredData = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "name": title,
      "description": description,
      "url": url,
      "image": image
    };

    if (type === 'product' && price) {
      return {
        ...baseSchema,
        "@type": "Product",
        "brand": brand ? { "@type": "Brand", "name": brand } : undefined,
        "category": category,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "IDR",
          "availability": `https://schema.org/${availability}`,
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          "seller": {
            "@type": "Organization",
            "name": siteName
          }
        }
      };
    }

    if (type === 'website') {
      return {
        ...baseSchema,
        "@type": "LocalBusiness",
        "telephone": "+62-812-1234-9564",
        "priceRange": "$$",
        "serviceType": ["Camera Rental", "Photography Equipment", "Drone Rental"],
        "areaServed": {
          "@type": "Country",
          "name": "Indonesia"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Indonesia"
        }
      };
    }

    return baseSchema;
  };

  React.useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName }
    ];
    
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
    
    // Update Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];
    
    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });
    
    // Update structured data
    let structuredDataScript = document.querySelector('#structured-data');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      structuredDataScript.setAttribute('id', 'structured-data');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(generateStructuredData(), null, 2);
    
    // Cleanup function
    return () => {
      // Optional: Reset to default values when component unmounts
    };
  }, [title, description, keywords, image, price, url, type, category, brand, availability, fullTitle, siteName]);

  return null; // This component doesn't render anything
};

export default EnhancedSEOHead;

// Usage examples:
export const useProductSEO = (product: any) => {
  return {
    title: `Sewa ${product.name}`,
    description: `Sewa ${product.name} berkualitas tinggi dari ${product.brand?.name || 'brand terpercaya'}. Harga mulai Rp ${product.price?.toLocaleString('id-ID')}/hari. Proses mudah dan cepat!`,
    keywords: `rental ${product.name}, sewa ${product.category?.name}, ${product.brand?.name}, sewa kamera ${product.category?.name}`,
    image: product.thumbnail ? `${import.meta.env.VITE_STORAGE_BASE_URL}/${product.thumbnail}` : undefined,
    price: product.price,
    type: 'product' as const,
    category: product.category?.name,
    brand: product.brand?.name,
    availability: product.status === 'available' ? 'InStock' as const : 'OutOfStock' as const
  };
};

export const useCategorySEO = (category: any, productCount?: number) => {
  return {
    title: `Rental ${category.name} - Kamera & Peralatan Fotografi`,
    description: `Sewa ${category.name} berkualitas tinggi untuk kebutuhan fotografi Anda. ${productCount ? `${productCount} pilihan produk` : 'Berbagai pilihan'} dengan harga terjangkau dan pelayanan terbaik.`,
    keywords: `rental ${category.name}, sewa ${category.name}, ${category.name} rental Indonesia`,
    type: 'website' as const
  };
};
