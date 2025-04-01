// -- Create roles table (needed for user_roles)
// CREATE TABLE auth.roles (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(50) UNIQUE NOT NULL,
//     description TEXT
// );

// -- Create users table
// CREATE TABLE auth.users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(100) UNIQUE NOT NULL,
//     email VARCHAR(100) UNIQUE NOT NULL,
//     password_hash VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP(6) DEFAULT NOW(),
//     updated_at TIMESTAMP(6) DEFAULT NOW(),
//     role VARCHAR(50) DEFAULT 'user'
// );

// -- Create user_roles junction table
// CREATE TABLE auth.user_roles (
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     role_id INTEGER REFERENCES auth.roles(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     PRIMARY KEY (user_id, role_id)
// );

// -- Create sessions table
// CREATE TABLE auth.sessions (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     session_token VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create password_resets table
// CREATE TABLE auth.password_resets (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     reset_token VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create blog_types table
// CREATE TABLE auth.blog_types (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) UNIQUE NOT NULL,
//     image_url TEXT,
//     description TEXT
// );

// -- Create blogs table
// CREATE TABLE auth.blogs (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     content TEXT NOT NULL,
//     image_url TEXT,
//     author_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     blog_type_id INTEGER REFERENCES auth.blog_types(id) ON UPDATE NO ACTION,
//     created_at TIMESTAMP(6) DEFAULT NOW(),
//     hero_image TEXT,
//     blog_image_one TEXT,
//     blog_image_two TEXT,
//     blog_image_three TEXT,
//     author_avatar TEXT,
//     epigraph TEXT,
//     first_paragraph TEXT,
//     second_paragraph TEXT,
//     third_paragraph TEXT,
//     fourth_paragraph TEXT,
//     fifth_paragraph TEXT,
//     annotation_image_one TEXT,
//     annotation_image_two TEXT,
//     annotation_image_three TEXT,
//     annotation_image_four TEXT,
//     annotation_image_five TEXT,
//     point_one_title VARCHAR(255),
//     point_one_description TEXT,
//     point_two_title VARCHAR(255),
//     point_two_description TEXT,
//     point_three_title VARCHAR(255),
//     point_three_description TEXT,
//     point_four_title VARCHAR(255),
//     point_four_description TEXT,
//     point_five_title VARCHAR(255),
//     point_five_description TEXT,
//     categories VARCHAR(255),
//     more_blogs TEXT,
//     meta_description TEXT,
//     keywords TEXT,
//     meta_author VARCHAR(255),
//     meta_og_title VARCHAR(255),
//     meta_og_url TEXT,
//     meta_og_image TEXT,
//     meta_facebook_id TEXT,
//     meta_site_name TEXT,
//     meta_post_twitter TEXT,
//     status VARCHAR(20) DEFAULT 'visible'
// );

// -- Create blog_images table
// CREATE TABLE auth.blog_images (
//     id SERIAL PRIMARY KEY,
//     blog_id INTEGER REFERENCES auth.blogs(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     image_url TEXT NOT NULL
// );

// -- Create categories table
// CREATE TABLE auth.categories (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(100) UNIQUE NOT NULL
// );

// -- Create products table
// CREATE TABLE auth.products (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     description TEXT,
//     price DECIMAL(10, 2) NOT NULL,
//     stock_quantity INTEGER DEFAULT 0,
//     category_id INTEGER REFERENCES auth.categories(id) ON UPDATE NO ACTION,
//     image_url TEXT,
//     created_at TIMESTAMP(6) DEFAULT NOW(),
//     updated_at TIMESTAMP(6) DEFAULT NOW(),
//     discount_percentage INTEGER DEFAULT 0,
//     views INTEGER DEFAULT 0
// );

// -- Create reviews table
// CREATE TABLE auth.reviews (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     product_id INTEGER REFERENCES auth.products(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     rating INTEGER,
//     comment TEXT,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create cart table
// CREATE TABLE auth.cart (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     product_id INTEGER REFERENCES auth.products(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     quantity INTEGER NOT NULL,
//     price DECIMAL(10, 2) NOT NULL,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create orders table
// CREATE TABLE auth.orders (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     total_price DECIMAL(10, 2) NOT NULL,
//     status VARCHAR(50) DEFAULT 'Pending',
//     created_at TIMESTAMP(6) DEFAULT NOW(),
//     browser_used VARCHAR(50)
// );

// -- Create order_items table
// CREATE TABLE auth.order_items (
//     id SERIAL PRIMARY KEY,
//     order_id INTEGER REFERENCES auth.orders(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     product_id INTEGER REFERENCES auth.products(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     quantity INTEGER NOT NULL,
//     price DECIMAL(10, 2) NOT NULL
// );

// -- Create financials table
// CREATE TABLE auth.financials (
//     id SERIAL PRIMARY KEY,
//     order_id INTEGER REFERENCES auth.orders(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     type VARCHAR(50),
//     amount DECIMAL(10, 2) NOT NULL,
//     description TEXT,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create payments table
// CREATE TABLE auth.payments (
//     id SERIAL PRIMARY KEY,
//     order_id INTEGER REFERENCES auth.orders(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     payment_method VARCHAR(50),
//     transaction_id VARCHAR(255) UNIQUE NOT NULL,
//     status VARCHAR(50) DEFAULT 'Pending',
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create shipping_details table
// CREATE TABLE auth.shipping_details (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     full_name VARCHAR(255) NOT NULL,
//     country VARCHAR(100) NOT NULL,
//     city VARCHAR(100) NOT NULL,
//     street VARCHAR(255) NOT NULL,
//     apartment VARCHAR(255),
//     postal_code VARCHAR(20) NOT NULL,
//     phone VARCHAR(20) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create user_analytics table
// CREATE TABLE auth.user_analytics (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE NO ACTION,
//     browser VARCHAR(50),
//     device VARCHAR(50),
//     created_at TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create reports table
// CREATE TABLE auth.reports (
//     id SERIAL PRIMARY KEY,
//     report_type VARCHAR(50),
//     report_content TEXT,
//     report_date TIMESTAMP(6) DEFAULT NOW()
// );

// -- Create revenue table
// CREATE TABLE auth.revenue (
//     id SERIAL PRIMARY KEY,
//     total_income DECIMAL(15, 2) DEFAULT 0,
//     total_expense DECIMAL(15, 2) DEFAULT 0,
//     net_revenue DECIMAL(15, 2),
//     report_month DATE UNIQUE NOT NULL
// );