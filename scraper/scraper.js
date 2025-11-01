const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const BASE_URL = 'https://www.comune.codroipo.ud.it';
const SERVICES_URL = `${BASE_URL}/it/servizi-224003`;
const OUTPUT_DIR = path.join(__dirname, '..', 'knowledge-base');

/**
 * Scrape main services page
 */
async function scrapeServicesPage() {
  console.log('🔍 Scraping services page...');
  
  try {
    const response = await axios.get(SERVICES_URL);
    const $ = cheerio.load(response.data);
    const services = [];
    
    // This is a template - adjust selectors based on actual website structure
    $('.service-item, .list-item, article').each((i, element) => {
      const $el = $(element);
      const title = $el.find('h2, h3, .title').first().text().trim();
      const description = $el.find('p, .description').first().text().trim();
      const link = $el.find('a').first().attr('href');
      
      if (title) {
        services.push({
          title,
          description,
          link: link ? (link.startsWith('http') ? link : BASE_URL + link) : null
        });
      }
    });
    
    console.log(`✅ Found ${services.length} services`);
    return services;
  } catch (error) {
    console.error('❌ Error scraping services:', error.message);
    return [];
  }
}

/**
 * Scrape individual service page
 */
async function scrapeServiceDetails(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract details - adjust selectors based on actual structure
    const details = {
      fullDescription: $('main p').text().trim(),
      requirements: [],
      hours: '',
      contact: ''
    };
    
    // Extract requirements/documents
    $('ul li, .requirements li').each((i, el) => {
      const text = $(el).text().trim();
      if (text) details.requirements.push(text);
    });
    
    // Extract hours if available
    const hoursText = $('*:contains("orari"), *:contains("apertura")').first().text();
    if (hoursText) details.hours = hoursText.trim();
    
    return details;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

/**
 * Main scraping function
 */
async function main() {
  console.log('🚀 Starting web scraping...\n');
  
  // Create output directory
  await fs.ensureDir(OUTPUT_DIR);
  
  // Scrape main page
  const services = await scrapeServicesPage();
  
  // Scrape each service details (if links available)
  for (const service of services) {
    if (service.link) {
      console.log(`Scraping details for: ${service.title}`);
      const details = await scrapeServiceDetails(service.link);
      if (details) {
        Object.assign(service, details);
      }
      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save raw data
  const rawDataPath = path.join(OUTPUT_DIR, 'scraped-data.json');
  await fs.writeJSON(rawDataPath, services, { spaces: 2 });
  console.log(`\n💾 Raw data saved to: ${rawDataPath}`);
  
  // Transform to structured format
  const structuredServices = transformToStructuredFormat(services);
  const servicesPath = path.join(OUTPUT_DIR, 'services.json');
  await fs.writeJSON(servicesPath, structuredServices, { spaces: 2 });
  console.log(`💾 Structured data saved to: ${servicesPath}`);
  
  console.log('\n✅ Scraping completed!');
}

/**
 * Transform scraped data to structured format
 */
function transformToStructuredFormat(services) {
  const structured = {};
  
  services.forEach((service, index) => {
    const code = generateServiceCode(service.title);
    structured[code] = {
      code: code,
      name: service.title,
      description: service.description || service.fullDescription || '',
      office: 'Ufficio Comunale',
      hours: service.hours || 'Lunedì-Venerdì 9:00-13:00',
      documents: service.requirements || [],
      cost: 'Da verificare',
      processingTime: 'Da verificare',
      faq: generateDefaultFAQ(service.title),
      bookingEnabled: true
    };
  });
  
  return structured;
}

/**
 * Generate service code from title
 */
function generateServiceCode(title) {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 30);
}

/**
 * Generate default FAQ for a service
 */
function generateDefaultFAQ(serviceName) {
  return [
    {
      question: `Come posso richiedere il servizio ${serviceName}?`,
      answer: 'Puoi richiedere il servizio recandoti presso l\'ufficio comunale negli orari di apertura o prenotando un appuntamento tramite questo assistente.'
    },
    {
      question: 'Quali documenti devo portare?',
      answer: 'Ti consigliamo di portare un documento di identità valido. Per documenti specifici aggiuntivi, contatta l\'ufficio.'
    },
    {
      question: 'Quanto tempo richiede?',
      answer: 'I tempi di elaborazione variano in base al servizio. Contatta l\'ufficio per informazioni specifiche.'
    }
  ];
}

// Run scraper
main().catch(console.error);
