function TrustBadges() {
  const trustFactors = [
    {
      id: 1,
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders over Rs.500"
    },
    {
      id: 2,
      icon: "🔒",
      title: "Secure Payment",
      description: "SSL encrypted checkout"
    },
    {
      id: 3,
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day money back guarantee"
    },
    {
      id: 4,
      icon: "⭐",
      title: "Quality Assured",
      description: "Premium products only"
    },
    {
      id: 5,
      icon: "📞",
      title: "24/7 Support",
      description: "Always here to help"
    },
    {
      id: 6,
      icon: "⚡",
      title: "Fast Delivery",
      description: "Same day dispatch"
    }
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Shop With Us?</h3>
          <p className="text-gray-600">We're committed to providing the best shopping experience</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trustFactors.map((factor) => (
            <div 
              key={factor.id} 
              className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">{factor.icon}</div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {factor.title}
              </h4>
              <p className="text-gray-600 text-xs">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustBadges; 