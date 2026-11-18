const C = require("./components.cjs");
const {
  setPage,
  href,
  icon,
  link,
  image,
  label,
  heading,
  section,
  features,
  split,
  cta,
  form,
  faq,
  halls,
  hallCards,
  pricing,
  comparison,
  calendar,
  write,
  intro,
  field,
  select,
} = C;
const benefits = [
  [
    "landmark",
    "Elegant halls",
    "Beautiful spaces, considered details and an atmosphere that feels entirely yours.",
  ],
  [
    "chef-hat",
    "Premium catering",
    "Seasonal menus and thoughtful hospitality, from the first bite to the final toast.",
  ],
  [
    "clipboard-list",
    "Event planning",
    "A dedicated team to bring all the little things together.",
  ],
  [
    "gem",
    "Flexible packages",
    "A thoughtful collection for every extraordinary occasion.",
  ],
];
const quotes = () =>
  `<div class="card-grid testimonials">${[
    [
      "An evening we will never forget.",
      "From our first visit to the last dance, every detail felt so personal. The ballroom was breathtaking.",
      "Olivia & James",
      "Wedding reception",
    ],
    [
      "Every detail, thoughtfully handled.",
      "Our anniversary felt intimate and extraordinary. The team made the planning experience effortless.",
      "Amelia & Daniel",
      "Anniversary",
    ],
    [
      "A remarkable place to come together.",
      "Beautiful food, seamless coordination and an impressive setting for our annual celebration.",
      "Charlotte M.",
      "Corporate dinner",
    ],
  ]
    .map(
      ([t, q, n, e]) =>
        `<article class="quote-card"><div class="stars" role="img" aria-label="5 of 5 stars"><span class="rating-stars" aria-hidden="true">${Array.from({ length: 5 }, () => icon("star")).join("")}</span></div><h3>${t}</h3><blockquote>“${q}”</blockquote><div class="quote-person"><img class="avatar" src="${href(`assets/images/testimonial-${n.startsWith("Olivia") ? "olivia" : n.startsWith("Amelia") ? "amelia" : "charlotte"}.jpg`)}" alt="" width="40" height="40" loading="lazy" decoding="async" /><div><strong>${n}</strong><small>${e}</small></div></div></article>`,
    )
    .join("")}</div>`;
const stats = () =>
  `<div class="stats">${[
    ["15+", "Years of inspiration"],
    ["1,200+", "Celebrations imagined"],
    ["6", "Distinctive spaces"],
    ["500", "Guests, together"],
  ]
    .map(([n, t]) => `<div><strong>${n}</strong><span>${t}</span></div>`)
    .join("")}</div>`;
const galleryCard = (name, title, category) =>
  `<button class="gallery-tile" data-lightbox data-category="${category}" aria-label="View ${title}">${image(name, title)}<span>${title}<small>${category}</small>${icon("expand")}</span></button>`;
const timeline = () =>
  `<ol class="journey">${[
    ["Enquiry", "Tell us what you’re dreaming of."],
    ["Venue selection", "Find your perfect space."],
    ["Customization", "Curate your menu and styling."],
    ["Booking details", "Bring the plans together."],
    ["Celebration day", "We’ll handle the details."],
  ]
    .map(
      ([a, b], i) => `<li><span>0${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`,
    )
    .join("")}</ol>`;
const amenities = () =>
  features([
    [
      "car-front",
      "Arrive with ease",
      "Dedicated parking and an accessible entrance.",
    ],
    ["snowflake", "Perfect comfort", "Climate-controlled spaces throughout."],
    ["heart", "A moment to yourself", "Private bridal and preparation suites."],
    ["music-2", "Set the mood", "Professional sound and ambient lighting."],
    [
      "utensils",
      "Exceptional dining",
      "Flexible menus and dietary accommodations.",
    ],
    ["concierge-bell", "By your side", "A dedicated event coordinator."],
  ]).replace('class="feature-grid "', 'class="feature-grid amenity-photos"');
function home1() {
  setPage("pages/home1.html");
  const hero = `<section class="hero-classic"><div class="container hero-grid"><div class="hero-copy">${label("WHERE MOMENTS BECOME MEMORIES")}<h1>A grand setting.<br>A <em>beautiful</em><br>beginning.</h1><p>For the days you’ll remember forever. Discover extraordinary spaces, thoughtful hospitality, and celebrations that are unmistakably yours.</p><div class="actions">${link("Book your event", "pages/booking.html")}${link("Explore our halls", "pages/halls.html", true)}</div><div class="hero-proof"><div class="mini-arches">${icon("heart-handshake")}</div><div><strong>Thoughtfully hosted. Beautifully remembered.</strong><span>Weddings · Celebrations · Corporate events</span></div></div></div><div class="hero-art"><div class="hero-arch">${image("home-01-hero", "Grand ivory ballroom with chandeliers and dressed reception tables", 'fetchpriority="high" loading="eager"')}</div><div class="hero-seal"><span>THE ART OF</span>${icon("sparkles")}<span>CELEBRATION</span></div><div class="hero-caption"><span>01 / THE ROYAL GRAND BALLROOM</span><span>Made for your moment ${icon("arrow-right")}</span></div></div></div></section>`;
  const events = [
    "Weddings",
    "Engagements",
    "Birthdays",
    "Corporate events",
    "Anniversaries",
    "Private celebrations",
  ];
  write(
    "pages/home1.html",
    "Elegant Banquet & Celebration Spaces",
    hero +
      `<section class="section highlights" id="highlights"><div class="container">${features(benefits)}</div></section>` +
      section(
        "",
        split(
          "More than a venue.<br>A feeling you’ll remember.",
          "Some places simply feel special. From intimate gatherings to grand occasions, our considered spaces bring people together with warmth, elegance, and a touch of wonder.",
          "home-about",
          "Warm ivory stone entrance to The Grand Venue",
          false,
          "WELCOME TO THE GRAND VENUE",
        ) + stats(),
      ) +
      section(
        "Find the space that feels like you.",
        hallCards("home", 3),
        "Three distinctive halls. One exceptional standard of hospitality.",
        "surface",
      ) +
      section(
        "Life gives you reasons.<br>We give you the setting.",
        `<div class="event-collection">${events.map((t, i) => `<a href="${href("pages/booking.html?event=" + encodeURIComponent(t))}"><span>0${i + 1}</span><h3>${t}</h3>${icon("arrow-right")}</a>`).join("")}</div>`,
        "For every milestone, every gathering, every just-because.",
      ) +
      section(
        "Thoughtfully curated. Beautifully yours.",
        pricing(),
        "A collection of celebrations, with room to make each detail your own.",
        "surface",
      ) +
      section(
        "",
        split(
          "A feast for the senses.",
          "Beautiful food. Inspired styling. Impeccable timing. From a menu that tells your story to tables that set the scene, we bring the whole experience together.",
          "home-catering",
          "Fine dining banquet cuisine with champagne gold cutlery",
          true,
          "TASTE & ATMOSPHERE",
          ["Explore our services", "pages/services.html"],
        ),
      ) +
      section(
        "A glimpse of the extraordinary.",
        `<div class="gallery-editorial">${galleryCard("home-gallery-wedding", "The beginning of forever", "Weddings")}${galleryCard("home-gallery-dinner", "An evening to remember", "Anniversaries")}${galleryCard("home-gallery-corporate", "A gathering with distinction", "Corporate")}</div><div class="section-action">${link("Explore the gallery", "pages/gallery.html", true)}</div>`,
        "Inspiration for your next beautiful moment.",
        "surface",
      ) +
      section(
        "Beautiful moments. Happy hearts.",
        quotes(),
        "Thoughtful hospitality for life’s meaningful celebrations.",
      ) +
      section("", cta("The next beautiful story<br>could be yours.")),
  );
}
function home2() {
  setPage("pages/home2.html");
  write(
    "pages/home2.html",
    "A Modern Celebration Experience",
    `<section class="hero-cinematic">${image("home2-hero", "Luxury reception ballroom at dusk", 'fetchpriority="high" loading="eager"')}<div class="container"><div class="cinema-copy">${label("CELEBRATE SOMETHING EXTRAORDINARY")}<h1>Some moments<br>deserve <em>grand.</em></h1><p>A beautiful space. Your favorite people. Every detail, just as you imagined.</p><div class="actions">${link("Begin your celebration", "pages/booking.html")}${link("Find your space", "pages/halls.html", true)}</div></div></div></section>` +
      section(
        "",
        `<div class="editorial-intro"><div>${label("THE WAY A CELEBRATION SHOULD FEEL")}<h2>Considered spaces.<br>Unforgettable experiences.</h2><p>Step into a world of warm hospitality and quiet luxury, where your story is the centerpiece.</p>${stats()}</div>${image("home2-intro", "Ivory stone staircase inside the grand foyer")}</div>`,
      ) +
      section(
        "Made for the moments that matter.",
        `<div class="celebration-band">${["Weddings", "Receptions", "Engagements", "Social celebrations"].map((t, i) => `<a href="${href("pages/booking.html?event=" + t)}"><span>0${i + 1}</span><h3>${t}</h3><p>A setting as special as the occasion.</p>${icon("arrow-right")}</a>`).join("")}</div>`,
        "Bring your people together.",
        "surface",
      ) +
      section(
        "",
        `<div class="showcase">${image("home2-ballroom", "Signature ballroom overlooking a stone courtyard")}<div class="showcase-panel">${label("OUR SIGNATURE SPACE")}<h2>Room for<br>extraordinary.</h2><p>The Royal Grand Ballroom. Timeless architecture, modern comfort, endless possibility.</p><div class="spec-row"><span>500 guests</span><span>8,000 sq ft</span><span>Private suite</span></div>${link("Discover the ballroom", "pages/hall-details.html")}</div></div>`,
      ) +
      section(
        "From your first idea to the final toast.",
        timeline(),
        "A thoughtful journey, with you at the center.",
        "surface",
      ) +
      section(
        "",
        `<div class="culinary-layout"><div>${label("AT THE HEART OF THE TABLE")}<h2>Good food.<br>Great company.<br><em>Lasting memories.</em></h2><p>Seasonal ingredients, global inspiration, and a menu shaped around your celebration.</p><div class="menu-lines"><p>01 <strong>Chef-crafted menus</strong></p><p>02 <strong>Interactive live stations</strong></p><p>03 <strong>Something sweet to finish</strong></p></div>${link("Taste the possibilities", "pages/services.html", true)}</div>${image("home2-food", "Elegant pastry and dessert station")}</div>`,
      ) +
      section(
        "Your vision, brought beautifully to life.",
        `<div class="decoration-grid">${galleryCard("home2-decor-classic", "Timeless romance", "Classic styling")}${galleryCard("home2-decor-modern", "Modern elegance", "Contemporary styling")}</div>`,
        "Understated details. Breathtaking entrances.",
        "surface",
      ) +
      section(
        "Every comfort. Every detail.",
        amenities(),
        "Everything you need to feel completely at ease.",
      ) +
      section(
        "The best part? How it feels.",
        `<div class="story-panel"><div class="large-quote">“</div><blockquote>We arrived with a vision. We left with memories we’ll treasure for a lifetime.</blockquote><div class="story-author"><img src="${href("assets/images/testimonial-emma-oliver.webp")}" alt="" width="72" height="72" loading="lazy" decoding="async"><p>Emma &amp; Oliver</p></div>${link("Read our celebration journal", "pages/blog.html", true)}</div>`,
        "",
        "surface",
      ) +
      section(
        "Come see what’s possible.",
        `<div class="visit-grid"><div>${image("home2-visit", "Ivory venue lounge with warm brass lighting")}<p class="image-note">Your next chapter starts with a visit.</p></div>${form("visit", true)}</div>`,
        "Request a relaxed walk-through and start imagining your day.",
      ),
  );
}
function publicPages() {
  let f = "pages/about.html";
  setPage(f);
  write(
    f,
    "Our Story",
    intro(
      "A place for life’s beautiful chapters.",
      "Rooted in hospitality. Inspired by your stories. Designed for connection.",
      "OUR STORY",
    ) +
      section(
        "",
        split(
          "Built around the way you celebrate.",
          "Our venue story begins with a simple belief: gathering should feel special. From a family idea to six remarkable spaces, thoughtful hospitality remains at our heart.",
          "about-story",
          "Historic ivory stone venue facade",
          true,
          "SINCE 2011",
          null,
        ) +
          `<div class="milestones"><span><strong>2011</strong> A vision begins</span><span><strong>2016</strong> New possibilities</span><span><strong>2026</strong> A new chapter</span></div>`,
      ) +
      section(
        "What we believe in.",
        features([
          [
            "heart-handshake",
            "Personal, always",
            "Your vision guides every decision.",
          ],
          ["gem", "Excellence in the details", "Quality you can see and feel."],
          [
            "accessibility",
            "A welcome for everyone",
            "Accessible spaces for your people.",
          ],
        ]),
        "Little things make a big difference.",
        "surface",
      ) +
      section(
        "",
        split(
          "The luxury of feeling at ease.",
          "From private preparation suites to beautifully equipped dining spaces, every corner is designed around your comfort.",
          "about-experience",
          "Ivory bridal suite with elegant mirrors",
          false,
          "THE VENUE EXPERIENCE",
          ["Explore our spaces", "pages/halls.html"],
        )
          .replace(
            "Thoughtfully designed, beautifully delivered",
            "Private suites for a relaxed start to your celebration",
          )
          .replace(
            "Your vision, with every detail considered",
            "Comfortable, climate-controlled spaces for your guests",
          )
          .replace(
            "A dedicated team from first visit to final toast",
            "Dining and event layouts tailored to your occasion",
          ),
      ) +
      section(
        "The people behind the moments.",
        `<div class="card-grid">${[
          ["team-director", "Sofia Bennett", "Venue Director"],
          ["team-chef", "Adrian Laurent", "Executive Chef"],
          ["team-planner", "Ethan Cole", "Celebration Planner"],
        ]
          .map(
            ([im, n, r]) =>
              `<article class="team-card">${image(im, `portrait of ${n}, ${r}`)}<h3>${n}</h3><p>${r}</p></article>`,
          )
          .join("")}</div>`,
        "Thoughtful minds. A love of celebration.",
        "surface",
      ) +
      section("Your trust means everything.", quotes() + cta()),
  );
  f = "pages/halls.html";
  setPage(f);
  write(
    f,
    "Our Banquet Halls",
    intro(
      "Find your extraordinary space.",
      "From a close-knit gathering to a grand reception, there’s a beautiful place for your occasion.",
    ) +
      section(
        "",
        `<div class="filter-panel" data-hall-filters>${select("capacity", "Minimum guest capacity", ["60", "150", "250", "350", "500"], false)}${select("eventFilter", "Event type", ["Wedding", "Engagement", "Corporate", "Anniversary", "Birthday"], false)}<button class="btn btn-secondary" data-reset-filters>Reset filters</button></div><p class="visually-hidden" data-filter-status role="status"></p>`,
      ) +
      section(
        "Six spaces. Endless possibilities.",
        hallCards(),
        "Find the right setting for your celebration.",
        "surface",
      ) +
      section(
        "A space for every gathering.",
        `<div class="table-wrap"><table><caption>Hall comparison</caption><thead><tr><th>Space</th><th>Capacity</th><th>Area</th><th>Estimate</th></tr></thead><tbody>${halls.map((h) => `<tr><td>${h[0]}</td><td>${h[1]} guests</td><td>${h[2]} sq ft</td><td>$${h[4]}</td></tr>`).join("")}</tbody></table></div>`,
      ) +
      section(
        "Comfort comes as standard.",
        amenities(),
        "A thoughtful approach to hosting.",
        "surface",
      ) +
      section("", cta("Let’s find your perfect setting.")),
  );
  f = "pages/hall-details.html";
  setPage(f);
  write(
    f,
    "Hall Details",
    `<section class="detail-hero section detail-hero-photo"><div class="container">${label("OUR SIGNATURE COLLECTION")}<h1 data-hall-name>Royal Grand Ballroom</h1><p>A grand canvas for meaningful moments.</p>${image("page-hero-hall-details", "Luminous ballroom with crystal chandeliers", 'fetchpriority="high" loading="eager"')}</div></section>` +
      section(
        "A closer look.",
        `<div class="decoration-grid">${galleryCard("detail-gallery1", "A place at the table", "Ballroom details")}${galleryCard("detail-gallery2", "The stage is yours", "Ballroom styling")}</div>`,
      ) +
      section(
        "Room to bring everyone together.",
        `<div class="spec-grid"><div><strong data-hall-capacity>500</strong><span>Maximum guests</span></div><div><strong data-hall-area>8,000</strong><span>Square feet</span></div><div><strong>12</strong><span>Hours available</span></div><div><strong data-hall-price>$6,500</strong><span>Starting hire</span></div></div>`,
        "",
        "surface",
      ) +
      section(
        "Set the scene your way.",
        features([
          [
            "utensils-crossed",
            "Banquet seating",
            "Round tables for conversation.",
          ],
          ["armchair", "Theatre seating", "A clear view of every moment."],
          ["martini", "Reception layout", "Room to mingle and dance."],
        ]).replace(
          'class="feature-grid "',
          'class="feature-grid amenity-photos seating-photos"',
        ) + amenities(),
      ) +
      section(
        "Picture a date in your diary.",
        `<div class="visit-grid">${calendar()}<div>${heading("Take the next step.", "Choose an available date, then customize your celebration.")}${link("Build your celebration", "pages/booking.html?hall=0").replace("<a ", "<a data-hall-booking ")}<p class="form-note">Availability is not live. No real reservation is made.</p></div></div>`,
        "",
        "surface",
      ) +
      section(
        "More room for inspiration.",
        `<div class="related-links">${halls
          .slice(1, 4)
          .map(
            (h, i) =>
              `<a href="${href("pages/hall-details.html?hall=" + (i + 1))}"><h3>${h[0]}</h3><p>Up to ${h[1]} guests</p>${icon("arrow-right")}</a>`,
          )
          .join("")}</div>`,
      ),
  );
  f = "pages/packages.html";
  setPage(f);
  write(
    f,
    "Celebration Packages",
    intro(
      "Beautifully considered. Simply celebrated.",
      "Choose your starting point. Make it entirely your own.",
    ) +
      section("The celebration collection.", pricing()) +
      section(
        "All the details, at a glance.",
        comparison(),
        "Transparent inclusions for easier planning.",
        "surface",
      ) +
      section(
        "",
        split(
          "A menu worth gathering for.",
          "Elevate your dining with live counters, gourmet buffet selections, dessert stations and beverage service. catering additions begin at $18 per guest.",
          "packages-food",
          "Gourmet banquet buffet with copper serving dishes",
          true,
          "AT YOUR TABLE",
          ["Customize your package", "pages/booking.html"],
        ),
      ) +
      section(
        "",
        split(
          "Let the atmosphere tell your story.",
          "A floral stage, candlelit centerpieces and finishing touches that feel like you. styling enhancements start at $350.",
          "packages-decor",
          "Blush floral centerpieces and romantic candles",
          false,
          "FINISHING TOUCHES",
          ["Explore your options", "pages/booking.html"],
        ),
        "",
        "surface",
      ) +
      section("A little clarity before you celebrate.", faq() + cta()),
  );
  f = "pages/services.html";
  setPage(f);
  write(
    f,
    "Our Services",
    intro(
      "Every detail. Beautifully together.",
      "A considered collection that lets you enjoy being in the moment.",
    ) +
      section(
        "",
        split(
          "Your story, thoughtfully planned.",
          "From first conversation to final toast, we create a celebration that feels like you. Timelines, suppliers and personal touches, coordinated with care subject to confirmation.",
          "services-wedding",
          "Ivory floral ceremony arch",
          false,
          "WEDDINGS & RECEPTIONS",
          ["Discover wedding planning", "pages/service-details.html"],
          [
            "A celebration timeline shaped around your day",
            "Supplier coordination and thoughtful personal touches",
            "Support from your first conversation to the final toast",
          ],
        ),
      ) +
      section(
        "",
        split(
          "An experience to savor.",
          "Chef-crafted menus, seasonal produce, live food stations and gracious service. A culinary experience made for your guests.",
          "services-catering",
          "Chef carefully plating banquet dishes",
          true,
          "CATERING & HOSPITALITY",
          ["Plan your menu", "pages/contact.html"],
          [
            "Seasonal menus created around your preferences",
            "Dietary requirements discussed with the catering team",
            "Live food stations and attentive table service",
          ],
        ),
        "",
        "surface",
      ) +
      section(
        "",
        `<div class="decoration-service">${image("services-decor", "Decorator arranging cream and burgundy roses")}<div>${label("DECORATION & STYLING")}<h2>The atmosphere<br>you imagined.</h2><p>Refined florals. Considered textures. Beautiful light. Styling that complements your story.</p>${link("Tell us your vision", "pages/contact.html", true)}</div></div>`,
      ) +
      section(
        "All the practical details, considered.",
        amenities(),
        "From parking to the final playlist.",
        "surface",
      ) +
      section("", cta()),
  );
  f = "pages/service-details.html";
  setPage(f);
  write(
    f,
    "Wedding Reception Planning",
    intro(
      "Your beginning. Beautifully planned.",
      "Wedding reception planning from the first idea to the last dance.",
    ) +
      section(
        "",
        split(
          "More joy. Less to organize.",
          "Your wedding should feel like a celebration, every step of the way. A dedicated planner listens, curates and coordinates so you can focus on what matters.",
          "service-intro",
          "Wedding planning flatlay with swatches and ribbons",
          true,
          "WHY PLAN WITH US",
          ["Start a conversation", "pages/contact.html"],
          [
            "One point of contact throughout your planning",
            "A clear timeline and coordinated supplier details",
            "Personal guidance for a celebration that feels like you",
          ],
        ),
      ) +
      section(
        "A thoughtful path to your day.",
        timeline(),
        "Clear details. Personal support.",
        "surface",
      ) +
      section(
        "The details are in good hands.",
        features([
          [
            "clipboard-check",
            "Planning & coordination",
            "A detailed schedule and supplier coordination.",
          ],
          [
            "flower-2",
            "Styling & atmosphere",
            "A cohesive concept for florals and lighting.",
          ],
          [
            "utensils",
            "Menu & hospitality",
            "Dietary planning and attentive service.",
          ],
          [
            "music",
            "Your celebration, flowing",
            "Arrival, reception and entertainment.",
          ],
        ]).replace(
          'class="feature-grid "',
          'class="feature-grid amenity-photos service-photos"',
        ),
      ) +
      section(
        "A package with room for you.",
        `<div class="service-pricing"><div><div class="section-heading"><h3>Planning that fits.</h3><p>Day coordination is included in Signature. Royal includes full planning. Bespoke estimates begin at $1,200.</p></div>${link("Compare packages", "pages/packages.html")}</div><ul class="check-list"><li>Personal consultation</li><li>Budget and timeline guidance</li><li>Supplier recommendations</li><li>On-the-day coordination</li></ul></div>`,
        "",
        "surface",
      ) +
      section("Your questions, considered.", faq() + cta()),
  );
  f = "pages/gallery.html";
  setPage(f);
  const cats = [
    "Weddings",
    "Engagements",
    "Birthdays",
    "Corporate Events",
    "Decorations",
    "Catering",
  ];
  write(
    f,
    "Celebration Gallery",
    intro(
      "A little inspiration. A world of possibility.",
      "Spaces, details and moments imagined for your next celebration.",
    ) +
      section(
        "",
        `<div class="filter-chips" data-filter-target="gallery">${["All", ...cats].map((t, i) => `<button class="chip ${i === 0 ? "active" : ""}" data-filter="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div><div class="gallery-grid">${["wedding", "engagement", "birthday", "corporate", "decorations", "catering"].map((n, i) => galleryCard("gallery-" + n, ["A timeless beginning", "An occasion to sparkle", "Make a wish", "Together, with distinction", "Beauty in the details", "A taste of celebration"][i], cats[i])).join("")}</div><p class="visually-hidden" data-gallery-status role="status"></p>`,
      ) +
      section(
        "",
        `<div class="featured-celebration">${image("gallery-feature", "Candlelit anniversary dinner with ivory roses")}<div>${label("IN FOCUS / AN EVENING TO REMEMBER")}<h2>The art of<br>coming together.</h2><p>An intimate anniversary, a candlelit table, and the people who make life beautiful. Sometimes, the smallest moments are the grandest.</p></div></div>`,
        "",
        "surface",
      ) +
      section("", cta("See the possibilities in person.")),
  );
  blogPages();
  contactBooking();
  f = "pages/pricing.html";
  setPage(f);
  write(
    f,
    "Simple Pricing",
    intro(
      "The details, beautifully clear.",
      "Thoughtful packages and transparent sample estimates.",
    ) +
      section("Choose your celebration.", pricing()) +
      section("Compare the collection.", comparison(), "", "surface") +
      section(
        "Something a little different?",
        `<div class="service-pricing"><div><h2>Let’s create something just for you.</h2><p>Large gatherings, intimate dining and everything in between. Tell us what you have in mind.</p></div>${link("Request an estimate", "pages/contact.html")}</div>`,
      ) +
      section(
        "Your pricing questions.",
        faq(),
        "Request a tailored estimate for your celebration.",
        "surface",
      ),
  );
}
function blogPages() {
  let f = "pages/blog.html";
  setPage(f);
  const articles = [
    [
      "blog-tables",
      "The art of a beautiful reception table",
      "Styling",
      "6 min read",
    ],
    ["blog-food", "A menu your guests will remember", "Catering", "5 min read"],
    [
      "blog-lights",
      "Small details. Extraordinary atmosphere.",
      "Planning",
      "4 min read",
    ],
  ];
  write(
    f,
    "The Celebration Journal",
    intro(
      "Ideas for your unforgettable.",
      "Thoughtful advice, beautiful details, and inspiration for the moments ahead.",
      "THE JOURNAL",
    ) +
      section(
        "",
        `<div class="blog-feature">${image("blog-feature", "Banquet seating plan and linen samples")}<div>${label("THE EDITOR’S PICK / PLANNING")}<h2>A thoughtful guide to finding your perfect venue.</h2><p>From your guest list to the little details, here’s what matters when choosing your celebration space.</p><p class="card-meta">November 12, 2026 · 8 min read</p>${link("Read the story", "pages/blog-details.html", true)}</div></div>`,
      ) +
      section(
        "",
        `<div class="blog-tools"><div class="field"><label for="blogSearch">Search the journal</label><input id="blogSearch" type="search" placeholder="Search stories and inspiration"></div><div class="filter-chips" data-filter-target="blog">${["All", "Styling", "Catering", "Planning"].map((t, i) => `<button class="chip ${i === 0 ? "active" : ""}" data-filter="${t}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div></div>`,
        "",
        "surface",
      ) +
      section(
        "A little more inspiration.",
        `<div class="card-grid" data-blog-grid>${articles.map(([im, t, c, time], i) => `<article class="card blog-card" data-category="${c}" data-title="${t}"><a class="card-image" href="${href("pages/blog-details.html?article=" + i)}">${image(im, t)}</a><div class="card-body"><p class="eyebrow">${c} / ${time}</p><h3>${t}</h3><p>Practical ideas to help create a celebration that feels like you.</p><a class="text-link" href="${href("pages/blog-details.html?article=" + i)}">Read the story ${icon("arrow-right")}</a></div></article>`).join("")}</div><p class="visually-hidden" data-blog-status role="status"></p><div class="pagination-controls"><button class="chip" data-blog-page="-1">Previous</button><span data-blog-page-label>Page 1 of 1</span><button class="chip" data-blog-page="1">Next</button></div>`,
      ) +
      section(
        "",
        `<div class="newsletter-panel">${heading("Good things, in your inbox.", "Occasional inspiration for your next celebration.")}<form data-form="newsletter" novalidate>${field("journalEmail", "Email address", "email")}<button class="btn btn-primary" type="submit">Keep me inspired ${icon("arrow-right")}</button><p class="form-result" role="status"></p><p class="form-note">Your request stays on this device. No email is sent.</p></form></div>`,
        "",
        "surface",
      ),
  );
  f = "pages/blog-details.html";
  setPage(f);
  write(
    f,
    "A Guide to Finding Your Perfect Venue",
    intro(
      "Your perfect venue starts with the right questions.",
      "A guide to choosing the setting for your next beautiful chapter.",
      "PLANNING / 8 MIN READ / NOVEMBER 12, 2026",
    ) +
      section(
        "",
        `<article class="article-layout"><div class="article-main">${image("article-main", "Planner inspecting reception tables")}<p class="article-lead">A venue is more than a beautiful room. It’s the backdrop to the people and moments you’ll remember.</p><h2>01. Begin with your people.</h2><p>Start with a realistic guest list. Think about how everyone moves through the day: arriving, gathering and sharing a meal. Ask about accessible routes, comfortable seating and quieter spaces.</p><h2>02. Picture the experience.</h2><p>Visit at a similar time to your celebration. Notice natural light, acoustics and the flow between rooms. Explore banquet and reception layouts, leaving room for dancing.</p><div class="article-callout">Ask: “What will our guests feel when they walk through the door?”</div><h2>03. Make the practical details clear.</h2><p>Request an itemized estimate. Confirm what catering, styling, coordination and setup include. Understand payment schedules and cancellation terms.</p><h2>04. Give yourself room to enjoy it.</h2><p>The right team brings calm as well as creativity. Choose people who listen carefully and communicate clearly.</p><p class="form-note">Confirm venue terms directly before making a commitment.</p></div><aside class="article-aside"><h3>Your venue visit checklist</h3><ul class="check-list"><li>Capacity & accessibility</li><li>Seating and event flow</li><li>Dietary options</li><li>Services & total costs</li><li>Backup plans</li></ul>${link("Plan a venue visit", "pages/contact.html")}</aside></article>`,
      ) +
      section(
        "Details worth remembering.",
        features([
          ["users", "Plan for comfort", "Leave room for guests and suppliers."],
          [
            "clock",
            "Allow a little time",
            "Build breathing room into transitions.",
          ],
          [
            "clipboard",
            "Get it in writing",
            "Confirm inclusions and responsibilities.",
          ],
        ]),
        "",
        "surface",
      ) +
      section(
        "Keep the inspiration going.",
        `<div class="decoration-grid">${[
          ["article-related1", "A delicious way to finish", "Catering"],
          ["article-related2", "A first impression to remember", "Styling"],
        ]
          .map(
            ([im, t, c]) =>
              `<article class="card">${image(im, t)}<div class="card-body"><p class="eyebrow">${c}</p><h3>${t}</h3><p>Discuss these ideas with our team and tailor them to your event.</p>${link("Ask our planners", "pages/contact.html", true)}</div></article>`,
          )
          .join("")}</div>`,
      ) +
      section(
        "Join the conversation.",
        `<form data-form="comment" class="form-panel" novalidate><div class="form-grid">${field("commentName", "Name")}${field("commentEmail", "Email", "email")}<div class="field full"><label for="comment">Your comment</label><textarea id="comment" name="comment" rows="4" placeholder="Share a planning question" required></textarea></div></div><button class="btn btn-primary" type="submit">Post comment</button><p class="form-result" role="status"></p></form><div data-comments></div>`,
        "",
        "surface",
      ),
  );
}
function bookingSections(dashboard = false) {
  const wrap = (t, b, cl = "") =>
    dashboard
      ? `<section class="dashboard-panel">${heading(t)}${b}</section>`
      : section(t, b, "", cl);
  return (
    `<form id="booking-form" novalidate>${dashboard ? "" : intro("Your celebration begins here.", "A few thoughtful details. A world of possibility.", "BOOKING / 01 — 06")}<div class="booking-guidance">${icon("info")} Requests stay on this device. No reservation or payment is processed.</div>` +
    wrap(
      "01 / Choose your space.",
      `<div class="hall-options">${halls.map((h, i) => `<label class="choice-card"><input type="radio" name="hall" value="${i}" ${i === 0 ? "checked" : ""}><span><strong>${h[0]}</strong><small><span class="choice-capacity">Up to ${h[1]} guests</span><span class="choice-price">From $${h[4]} <span>venue only</span></span></small></span></label>`).join("")}</div>`,
    ) +
    wrap(
      "02 / Make a date.",
      `<div class="form-grid">${field("eventDate", "Event date", "date")}${select("timeSlot", "Time slot", ["11:00–17:00", "18:00–00:00"])}${select("bookingEvent", "Event type", ["Wedding", "Engagement", "Birthday", "Corporate", "Anniversary", "Private celebration"])}${field("guestCount", "Number of guests", "number", "Enter expected guest count")}</div><p class="form-note">Past dates and reserved or unavailable dates cannot be selected.</p>${calendar()}`,
      "surface",
    ) +
    wrap(
      "03 / Curate the details.",
      `<div class="form-grid">${select("package", "Celebration package", ["Essential Celebration — $6,500", "Signature Celebration — $9,800", "Royal Celebration — $14,500"])}<div class="addon-checks"><label><input type="checkbox" name="catering" value="1800"> Live catering counter <strong>+$1,800</strong></label><label><input type="checkbox" name="decoration" value="1200"> Signature floral stage <strong>+$1,200</strong></label></div></div><p class="form-note">Package includes venue hire. Venue-only hall pricing is shown for reference and is not added again.</p>`,
    ) +
    wrap(
      "04 / A little about you.",
      `<div class="form-grid">${field("customerName", "Full name")}${field("customerEmail", "Email address", "email")}${field("customerPhone", "Phone number", "tel")}<div class="field"><label for="bookingNotes">Special requests</label><textarea name="notes" id="bookingNotes" placeholder="Dietary needs or styling ideas" rows="3"></textarea></div></div>`,
      "surface",
    ) +
    wrap(
      "05 / Your celebration, at a glance.",
      `<div class="booking-summary" data-booking-summary></div><label class="check-label"><input type="checkbox" name="agreement" required> I understand this request stays on this device and is not confirmed by the venue.</label><button class="btn btn-primary" type="submit">Save booking request ${icon("arrow-right")}</button><p class="form-result" role="status"></p><p class="form-note">Saved on this device. No information is sent to a venue.</p>`,
      "surface",
    ) +
    "</form>"
  );
}
function contactBooking() {
  let f = "pages/contact.html";
  setPage(f);
  write(
    f,
    "Get in Touch",
    intro(
      "Let’s start with a conversation.",
      "Tell us what you’re imagining. We’ll help you find the next step.",
    ) +
      section(
        "",
        features([
          ["mail", "Write to us", "Send an enquiry using the form below."],
          ["phone", "Plan a conversation", "Request a call with your enquiry."],
          [
            "map-pin",
            "Come say hello",
            "Arrange a viewing and receive arrival details.",
          ],
        ]),
      ) +
      section(
        "Tell us about your celebration.",
        `<div id="contact-form">${form()}</div>`,
        "We’d love to hear what you have in mind.",
        "surface",
      ) +
      section(
        "Find your way to something special.",
        `<div class="contact-map"><iframe title="Google Map ? sample location: Empire State Building, New York" src="https://maps.google.com/maps?q=Empire%20State%20Building%2C%2020%20W%2034th%20St%2C%20New%20York%2C%20NY%2010001&z=15&output=embed" width="1200" height="450" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><div class="contact-map-caption"><div><strong>Sample location</strong><p>Empire State Building, 20 W 34th St, New York, NY 10001</p></div><a class="btn btn-secondary" href="https://www.google.com/maps/dir/?api=1&destination=Empire+State+Building+New+York" target="_blank" rel="noopener noreferrer">Get directions</a></div></div>`,
      ) +
      section(
        "A warm welcome awaits.",
        `<div class="service-pricing"><div><h3>Make time to imagine.</h3><p>Visiting hours: Monday–Saturday, 10:00–18:00. Sunday by appointment.</p></div><ul class="check-list"><li>Allow 45 minutes for your visit</li><li>Bring your ideas and guest estimate</li><li>Accessible entrance and parking</li><li>Use the map above for sample directions</li></ul></div>`,
        "",
        "surface",
      ) +
      section(
        "Before you get in touch.",
        faq() +
          cta().replace('href="../pages/contact.html"', 'href="#contact-form"'),
      ),
  );
  f = "pages/booking.html";
  setPage(f);
  write(f, "Book Your Celebration", bookingSections());
  f = "pages/booking-confirmation.html";
  setPage(f);
  write(
    f,
    "Booking Request Saved",
    intro(
      "Your vision is taking shape.",
      "Saved in this browser. A real venue has not received or confirmed your booking.",
      "REQUEST SAVED",
    ) +
      section(
        "Your celebration details.",
        `<div data-confirmation-summary class="dashboard-panel"></div>`,
      ) +
      section(
        "A few beautiful finishing touches.",
        `<div data-confirmation-addons class="dashboard-panel"></div>`,
        "",
        "surface",
      ) +
      section(
        "A clear path to your celebration.",
        `<div data-confirmation-installments></div><p class="form-note">installments. No money has been collected.</p>`,
      ) +
      section(
        "What happens next?",
        features([
          [
            "clipboard-check",
            "Review your details",
            "Find your saved booking in the client dashboard.",
          ],
          [
            "messages-square",
            "Talk through your vision",
            "A real venue would confirm availability and pricing.",
          ],
          [
            "heart",
            "Enjoy the anticipation",
            "Start curating the details that make it yours.",
          ],
        ]) +
          `<div class="section-action">${link("Open client dashboard", "dashboard/client/index.html")}${link("Plan another celebration", "pages/booking.html", true)}</div>`,
        "",
        "surface",
      ),
  );
}
module.exports = {
  home1,
  home2,
  publicPages,
  bookingSections,
  amenities,
  stats,
};
