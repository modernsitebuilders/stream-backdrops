export default function ProductSchema({ products }) {
  // Per-product reviews are intentionally NOT emitted here. The only reviews we
  // have are site-wide (about the studio, not any single image), and Google's
  // review-snippet guidelines prohibit attaching the same rating to every
  // product — doing so risks a spammy-structured-data manual action. The site
  // rating belongs on Organization/service markup, not on 265 individual items.
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": `Premium HD virtual background in 2912×1632 resolution. ${product.name} for Zoom, Teams, and Google Meet.`,
        "image": `https://assets.streambackdrops.com/webp/${product.category}/${product.id.replace('-hd', '')}.webp`,
        "offers": {
          "@type": "Offer",
          "price": "4.99",
          "priceCurrency": "USD",
          "priceValidUntil": priceValidUntil,
          "availability": "https://schema.org/InStock",
          "url": `https://meetbackdrops.com/hd?product=${product.id}`,
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 0,
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
          }
        },
        "brand": {
          "@type": "Brand",
          "name": "MeetBackdrops"
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}