import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Main Hero/Welcome Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg mb-12">
          <h1 className="text-5xl font-extrabold mb-4 animate-fade-in-down">Welcome to MyStore Ecommerce!</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 animate-fade-in-up">
            Your one-stop shop for all your needs. Discover amazing products and seamless shopping experiences.
          </p>
        </section>

        {/* About Section */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">About MyStore</h2>
          <div className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              At **MyStore Ecommerce**, we are passionate about bringing you a curated selection of high-quality products right to your doorstep. Founded in {new Date().getFullYear() - 5}, our mission has always been to provide an unparalleled online shopping experience that is both convenient and enjoyable.
            </p>
            <p>
              We believe in **customer satisfaction** above all else. From the moment you browse our virtual aisles to the joyous unboxing of your purchase, we strive for excellence. Our dedicated team works tirelessly to source the best items, ensure competitive pricing, and offer exceptional customer support.
            </p>
            <p>
              Whether you're looking for the latest gadgets, trendy fashion, home essentials, or unique gifts, MyStore Ecommerce is here to fulfill your desires. Join our growing community of happy shoppers today!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;