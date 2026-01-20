import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://tamtech-finance.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // إذا أضفت صفحات مستقبلاً مثل /about أو /pricing أضفها هنا
  ]
}