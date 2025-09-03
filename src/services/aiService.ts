



// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Initialize Google Gemini
// const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);

// // Fallback phone database - fixed TypeScript types
// interface PhoneInfo {
//   specs: string;
//   note?: string;
// }

// const phoneResponses: Record<string, PhoneInfo> = {
//   'samsung galaxy s23': {
//     specs: 'Samsung Galaxy S23: 6.1" display, 8GB RAM, 128GB/256GB/512GB storage, Snapdragon 8 Gen 2, 50MP camera, 3900mAh battery. Price: $799-999',
//     note: 'Note: S23 comes with 8GB RAM, not 12GB. For 12GB RAM, consider Galaxy S23 Ultra or S24 series.'
//   },
//   'samsung galaxy s24': {
//     specs: 'Samsung Galaxy S24: 6.2" display, 8GB RAM, 128GB/256GB/512GB storage, Snapdragon 8 Gen 3, 50MP camera, 4000mAh battery. Price: $899-1099',
//   },
//   'iphone 15': {
//     specs: 'iPhone 15: 6.1" display, 6GB RAM, 128GB/256GB/512GB storage, A16 Bionic, 48MP camera, 3349mAh battery. Price: $799-1099'
//   },
//   'iphone 15 pro': {
//     specs: 'iPhone 15 Pro: 6.1" display, 8GB RAM, 128GB/256GB/512GB/1TB storage, A17 Pro, 48MP camera, 3274mAh battery. Price: $999-1499'
//   },
//   'google pixel 8': {
//     specs: 'Google Pixel 8: 6.2" display, 8GB RAM, 128GB/256GB storage, Tensor G3, 50MP camera, 4575mAh battery. Price: $699-799'
//   },
//   'google pixel 8 pro': {
//     specs: 'Google Pixel 8 Pro: 6.7" display, 12GB RAM, 128GB/256GB/512GB/1TB storage, Tensor G3, 50MP camera, 5050mAh battery. Price: $999-1299'
//   }
// };

// /**
//  * Get fallback response when AI service is unavailable
//  */
// const getFallbackResponse = (query: string): string => {
//   const lowerQuery = query.toLowerCase();
  
//   // Check for specific phone models
//   for (const [phone, info] of Object.entries(phoneResponses)) {
//     if (lowerQuery.includes(phone.replace(/\s+/g, ' '))) {
//       const noteText = info.note ? `\n\n${info.note}` : '';
//       return `🤖 Dimbop AI (Offline Mode): ${info.specs}${noteText}`;
//     }
//   }
  
//   // Photography phones
//   if (lowerQuery.includes('photography') || lowerQuery.includes('camera')) {
//     return `🤖 Dimbop AI (Offline Mode): Best phones for photography:

// 📸 **Premium Options:**
// - iPhone 15 Pro/Pro Max - Excellent video, natural colors
// - Google Pixel 8 Pro - Best AI photo features, night mode
// - Samsung Galaxy S24 Ultra - 200MP camera, 100x zoom

// 📸 **Budget Options:**
// - Google Pixel 8 - Great AI photography at lower price
// - Samsung Galaxy S23 - Solid all-round camera performance

// What's your budget range?`;
//   }
  
//   // Generic phone advice
//   if (lowerQuery.includes('recommend') || lowerQuery.includes('best phone')) {
//     return `🤖 Dimbop AI (Offline Mode): Popular 2024 phones include:
    
// - Samsung Galaxy S23/S24 - Great cameras, premium build
// - iPhone 15 - Smooth iOS, excellent performance  
// - Google Pixel 8 - Best AI features, pure Android
// - OnePlus 12 - Fast charging, good value

// What's your budget and main use case?`;
//   }
  
//   if (lowerQuery.includes('storage') || lowerQuery.includes('gb')) {
//     return `🤖 Dimbop AI (Offline Mode): For storage recommendations:
// - 128GB - Basic users
// - 256GB - Most users (recommended)
// - 512GB - Heavy users, lots of photos/videos
// - 1TB - Professional use, extensive media`;
//   }
  
//   return `🤖 Dimbop AI (Offline Mode): I can help with phone specifications, recommendations, and comparisons. Please ask about specific phone models or features you're interested in.`;
// };

// /**
//  * Answer user queries about phones using Google Gemini AI
//  */
// export const askPhoneAI = async (query: string): Promise<string> => {
//   try {
//     if (!query || query.trim().length === 0) {
//       return 'Please provide a valid question about phones.';
//     }

//     // Try Google Gemini first
//     if (process.env.GEMINI_API_KEY && genAI) {
//       console.log('🤖 Using Google Gemini AI');
      
//       try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         const prompt = `You are Dimbop AI assistant, a specialized mobile phone expert. 

// RULES:
// - ONLY answer questions about mobile phones, smartphones, and related accessories
// - Be helpful, accurate, and concise
// - Include specifications, prices, and comparisons when relevant
// - If asked about non-phone topics, politely redirect to phone-related questions
// - Keep responses under 200 words

// User Question: ${query}`;
        
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();
        
//         if (text && text.trim().length > 0) {
//           return `🤖 Dimbop AI: ${text.trim()}`;
//         }
//       } catch (geminiError: any) {
//         console.error('🚨 Gemini AI error:', geminiError.message);
//       }
//     }

//     // Fallback to local database
//     console.warn('⚠️ Using fallback mode');
//     return getFallbackResponse(query);

//   } catch (error: any) {
//     console.error('🚨 AI service error:', error);
//     return getFallbackResponse(query);
//   }
// };

// /**
//  * Generate report for digital marketers
//  */
// export const generateReport = async (
//   reportType: string,
//   startDate?: string,
//   endDate?: string
// ): Promise<string> => {
//   try {
//     // Mock data for different report types
//     const mockData: Record<string, string> = {
//       'sales': 'Samsung leads with 23% market share, followed by Apple (20%) and Xiaomi (13%). Foldable phones saw 150% growth.',
//       'phone-sales': 'Samsung leads with 23% market share, followed by Apple (20%) and Xiaomi (13%). Foldable phones saw 150% growth.',
//       'user_activity': 'Users spend avg 6.5 hours daily on phones. Top activities: Social media (35%), Gaming (25%), Photography (15%)',
//       'market-trends': 'AI features and foldable phones are trending in 2024. 5G adoption reached 68% globally.',
//       'user-behavior': '67% prefer phones with 256GB+ storage, 45% prioritize camera quality, 38% want fast charging',
//       'inventory': 'Current stock levels: iPhone 15 (450 units), Galaxy S24 (320 units), Pixel 8 (180 units)',
//       'revenue': 'Q3 2024 revenue: $2.1M total, avg order value $780, 15% growth vs Q2'
//     };
    
//     const data = mockData[reportType.toLowerCase()] || mockData[reportType] || 'No specific data available for this report type';
    
//     return `📊 **${reportType.toUpperCase()} REPORT**

// 📅 **Period:** ${startDate || 'N/A'} to ${endDate || 'N/A'}
// 📈 **Key Insights:** ${data}
// ⏰ **Generated:** ${new Date().toLocaleString()}

// ---
// *Report by Dimbop AI Analytics*`;
    
//   } catch (error) {
//     console.error('Report generation error:', error);
//     return `❌ Report generation failed for "${reportType}". Please try again with valid parameters.`;
//   }
// };

// // Test function
// export const testQuery = async (): Promise<string> => {
//   const testQuery = "What's the best phone for photography?";
//   const result = await askPhoneAI(testQuery);
//   console.log('Test result:', result);
//   return result;
// };









import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { UploadedFile } from '../types/file';

// Initialize Google Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const prisma = new PrismaClient();

console.log('Google Gemini API key exists:', !!process.env.GEMINI_API_KEY);

// Helper function to convert file to base64
const fileToGenerativePart = (filePath: string, mimeType: string) => {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType
    },
  };
};

// Get product data from database
const getProductsFromDB = async () => {
  return await prisma.products.findMany({
    include: {
      categories: true,
      reviews: true,
    },
  });
};

// Get blog data from database
const getBlogsFromDB = async () => {
  return await prisma.blogs.findMany({
    where: { status: 'visible' },
    include: { blog_images: true },
  });
};

// Get user statistics
const getUserStats = async () => {
  const totalUsers = await prisma.users.count();
  const usersByRole = await prisma.users.groupBy({
    by: ['role'],
    _count: { role: true },
  });
  return { totalUsers, usersByRole };
};

/**
 * Enhanced AI function that handles text, images, and audio
 */
export const askPhoneAI = async (
  query: string,
  imageFile?: UploadedFile,
  audioFile?: UploadedFile
): Promise<string> => {
  try {
    if (!query || query.trim().length === 0) {
      return 'Please provide a valid question about phones, products, or our services.';
    }

    // Try Google Gemini first
    if (process.env.GEMINI_API_KEY && genAI) {
      console.log('🤖 Using Google Gemini AI with database integration');
      
      try {
        // Fetch database data
        const products = await getProductsFromDB();
        const blogs = await getBlogsFromDB();
        const userStats = await getUserStats();

        // Prepare database context
        const dbContext = `
DATABASE CONTEXT:
=================

PRODUCTS (${products.length} total):
${products.slice(0, 10).map(p => `
- ${p.name}: $${Number(p.price)} (Stock: ${p.stock_quantity})
  Category: ${p.categories?.name || 'N/A'}
  Description: ${p.description}
  Discount: ${p.discount_percentage}%
  Average Rating: ${p.reviews?.length ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length).toFixed(1) : 'N/A'}
`).join('')}

BLOGS (${blogs.length} total):
${blogs.slice(0, 5).map(b => `
- Title: ${b.title}
  Description: ${b.description}
  Categories: ${b.categories}
`).join('')}

USER STATISTICS:
- Total Users: ${userStats.totalUsers}
- Users by Role: ${userStats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}
`;

        const model = genAI.getGenerativeModel({ 
          model: imageFile ? "gemini-1.5-pro-vision-latest" : "gemini-1.5-flash" 
        });

        let prompt = `You are Dimbop AI assistant, a specialized mobile phone and e-commerce expert with access to our live database.

${dbContext}

CAPABILITIES:
- Answer questions about mobile phones, smartphones, and accessories
- Recommend products from our database with accurate prices and availability
- Provide information about our blog content
- Generate user and sales statistics
- Analyze images to help users find products
- Process audio queries and convert to text responses

RULES:
- Always use REAL data from the database context above
- Include actual prices, stock levels, and product details
- When recommending products, mention if they're in stock
- For image analysis, identify phones/products and match with our inventory
- Keep responses helpful, accurate, and under 300 words
- If asked about non-phone/non-business topics, politely redirect

User Query: ${query}`;

        const parts: any[] = [prompt];

        // Handle image analysis
        if (imageFile) {
          console.log('🖼️ Processing image with Gemini Vision');
          const imagePart = fileToGenerativePart(imageFile.path, imageFile.mimetype);
          parts.push(imagePart);
          prompt += `\n\nIMAGE ANALYSIS: Please analyze the provided image. If it shows a phone or electronic device, try to identify it and recommend similar products from our database.`;
        }

        // Handle audio processing (convert to text first)
        if (audioFile) {
          console.log('🎵 Processing audio file');
          // Note: Gemini doesn't directly process audio yet, so we'd need a separate service
          prompt += `\n\nAUDIO PROCESSING: User provided an audio file with their query.`;
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();
        
        if (text && text.trim().length > 0) {
          return `🤖 Dimbop AI: ${text.trim()}`;
        }
      } catch (geminiError: any) {
        console.error('🚨 Gemini AI error:', geminiError.message);
      }
    }

    // Fallback to enhanced local database
    console.warn('⚠️ Using enhanced fallback mode with database');
    return await getFallbackResponseWithDB(query);

  } catch (error: any) {
    console.error('🚨 AI service error:', error);
    return `🤖 Dimbop AI (Error): Sorry, I encountered an issue. Please try again. Error: ${error.message}`;
  }
};

/**
 * Enhanced fallback response with database integration
 */
const getFallbackResponseWithDB = async (query: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  
  try {
    // Product search and recommendations
    if (lowerQuery.includes('product') || lowerQuery.includes('phone') || lowerQuery.includes('price')) {
      const products = await getProductsFromDB();
      
      // Search for specific products
      const matchingProducts = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.categories?.name.toLowerCase().includes(lowerQuery)
      );

      if (matchingProducts.length > 0) {
        const productList = matchingProducts.slice(0, 3).map(p => 
          `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity && p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : 'Out of stock'})`
        ).join('\n');
        
        return `🤖 Dimbop AI (Database): Found ${matchingProducts.length} matching products:\n\n${productList}\n\nWould you like more details about any of these?`;
      }

      // General product recommendations
      const topProducts = products
        .filter(p => p.stock_quantity && p.stock_quantity > 0)
        .slice(0, 5);
      
      return `🤖 Dimbop AI (Database): Here are our top available products:\n\n${topProducts.map(p => 
        `📱 ${p.name} - $${Number(p.price)} (${p.stock_quantity} left)`
      ).join('\n')}`;
    }

    // Blog-related queries
    if (lowerQuery.includes('blog') || lowerQuery.includes('article') || lowerQuery.includes('guide')) {
      const blogs = await getBlogsFromDB();
      const recentBlogs = blogs.slice(0, 3);
      
      return `🤖 Dimbop AI (Database): We have ${blogs.length} blog posts available:\n\n${recentBlogs.map(b => 
        `📖 ${b.title}\n   ${b.description?.substring(0, 100)}...`
      ).join('\n\n')}`;
    }

    // User statistics
    if (lowerQuery.includes('user') || lowerQuery.includes('customer') || lowerQuery.includes('member')) {
      const stats = await getUserStats();
      return `🤖 Dimbop AI (Database): User Statistics:\n\n👥 Total Users: ${stats.totalUsers}\n📊 By Role: ${stats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}`;
    }

    // Default response
    return `🤖 Dimbop AI (Database): I can help you with:
    
🛍️ Product information and recommendations
📱 Phone comparisons and specifications  
📖 Blog content and guides
📊 User and sales statistics
🖼️ Image analysis (upload an image)

What would you like to know?`;

  } catch (error) {
    console.error('Database query error:', error);
    return `🤖 Dimbop AI (Database Error): Sorry, I'm having trouble accessing our database. Please try again later.`;
  }
};

/**
 * Enhanced report generation with real database data
 */
export const generateReport = async (
  reportType: string,
  startDate?: string,
  endDate?: string
): Promise<string> => {
  try {
    console.log('📊 Generating report:', reportType);

    // Parse date range if provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    switch (reportType.toLowerCase()) {
      case 'products':
      case 'product-sales':
      case 'inventory': {
        const products = await prisma.products.findMany({
          include: { categories: true, reviews: true, cart: true }
        });

        const totalProducts = products.length;
        const inStock = products.filter(p => (p.stock_quantity || 0) > 0).length;
        const outOfStock = totalProducts - inStock;
        const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * (p.stock_quantity || 0)), 0);
        const avgPrice = products.reduce((sum, p) => sum + Number(p.price), 0) / totalProducts;

        return `📊 **PRODUCT INVENTORY REPORT**

📅 **Period:** ${start.toLocaleDateString()} to ${end.toLocaleDateString()}
📦 **Total Products:** ${totalProducts}
✅ **In Stock:** ${inStock}
❌ **Out of Stock:** ${outOfStock}
💰 **Total Inventory Value:** $${totalValue.toLocaleString()}
📊 **Average Price:** $${avgPrice.toFixed(2)}

**TOP CATEGORIES:**
${await getCategoryBreakdown()}

⏰ **Generated:** ${new Date().toLocaleString()}`;
      }

      case 'users':
      case 'user-activity': {
        const userStats = await getUserStats();
        const recentUsers = await prisma.users.count({
          where: {
            created_at: { gte: start }
          }
        });

        return `📊 **USER ACTIVITY REPORT**

📅 **Period:** ${start.toLocaleDateString()} to ${end.toLocaleDateString()}
👥 **Total Users:** ${userStats.totalUsers}
🆕 **New Users (Period):** ${recentUsers}
📊 **Users by Role:** ${userStats.usersByRole.map(r => `${r.role}: ${r._count.role}`).join(', ')}

⏰ **Generated:** ${new Date().toLocaleString()}`;
      }

      case 'blogs':
      case 'content': {
        const totalBlogs = await prisma.blogs.count();
        const visibleBlogs = await prisma.blogs.count({ where: { status: 'visible' } });
        const recentBlogs = await prisma.blogs.count({
          where: { created_at: { gte: start } }
        });

        return `📊 **CONTENT REPORT**

📅 **Period:** ${start.toLocaleDateString()} to ${end.toLocaleDateString()}
📖 **Total Blogs:** ${totalBlogs}
👁️ **Visible Blogs:** ${visibleBlogs}
🆕 **New Blogs (Period):** ${recentBlogs}

⏰ **Generated:** ${new Date().toLocaleString()}`;
      }

      case 'sales':
      case 'revenue': {
        // Handle cart data with proper Decimal conversion
        const cartItems = await prisma.cart.findMany({
          include: { products: true }
        });

        const totalCartValue = cartItems.reduce((sum, item) => 
          sum + (item.price ? Number(item.price) : 0), 0);
        
        return `📊 **SALES REPORT**

📅 **Period:** ${start.toLocaleDateString()} to ${end.toLocaleDateString()}
🛒 **Items in Carts:** ${cartItems.length}
💰 **Potential Revenue:** $${totalCartValue.toLocaleString()}
📊 **Average Cart Value:** $${(totalCartValue / Math.max(cartItems.length, 1)).toFixed(2)}

⏰ **Generated:** ${new Date().toLocaleString()}`;
      }

      default: {
        return `📊 **GENERAL REPORT**

📅 **Period:** ${start.toLocaleDateString()} to ${end.toLocaleDateString()}
📦 **Products:** ${await prisma.products.count()}
👥 **Users:** ${await prisma.users.count()}
📖 **Blogs:** ${await prisma.blogs.count()}

⏰ **Generated:** ${new Date().toLocaleString()}`;
      }
    }
  } catch (error: any) {
    console.error('Report generation error:', error);
    return `❌ Report generation failed for "${reportType}". Error: ${error.message}`;
  }
};

// Helper function for category breakdown
const getCategoryBreakdown = async (): Promise<string> => {
  try {
    const categories = await prisma.categories.findMany({
      include: { _count: { select: { products: true } } }
    });

    return categories
      .sort((a, b) => b._count.products - a._count.products)
      .slice(0, 5)
      .map(cat => `- ${cat.name}: ${cat._count.products} products`)
      .join('\n');
  } catch {
    return '- Category data unavailable';
  }
};