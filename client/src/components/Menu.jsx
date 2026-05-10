import { useState, useRef, useEffect } from 'react'
import SectionHeader from './SectionHeader'

const TABS = [
  { id: 'mains', label: 'Mains & Sides' },
  { id: 'pizza', label: 'Wood-Fired Pizza' },
  { id: 'desserts', label: 'Desserts & Cocktails' },
]

const MAINS = [
  {
    section: 'Rustic Italia',
    items: [
      {
        name: 'Pizza',
        description: 'A fiery fusion of old-world Italian tradition and Texas-inspired craftsmanship. Each pie is hand-stretched and kissed by the flames of our wood-fired oven.',
      },
      {
        name: 'Foccaccia',
        description: 'A perfect harmony of Italian tradition and wood-fired artistry. Handcrafted and topped with bold flavors — rustic perfection in every bite.',
      },
      {
        name: 'Fire-Roasted Veggies',
        description: 'A smoky celebration of fresh, seasonal produce. Flame-charred to perfection, they\'re bursting with bold, natural flavors.',
      },
    ],
  },
  {
    section: 'Smokeworks',
    items: [
      {
        name: 'Pitmaster\'s Pride',
        description: 'Our 12-hour smoked brisket, dusted in our house rub, melts in your mouth — while burnt ends deliver a caramelized and bold smoky kick.',
      },
      {
        name: 'Hog\'s Share',
        description: 'From tender, smoky pulled pork to succulent, flame-seared pork belly — slow-cooked and fire-finished, these dishes honor the art of barbecue.',
      },
      {
        name: 'Feather & Flame',
        description: 'Juicy, fire-roasted chicken and tender, smoked turkey — perfectly seasoned and kissed by the flames. Rustic charm with every bite.',
      },
    ],
  },
  {
    section: 'Italian Cowboy Sides',
    items: [
      {
        name: 'Calabrian Slaw',
        description: 'Crisp shredded cabbage, thin-sliced fennel, and julienned carrots tossed in a zesty Calabrian chili-lemon dressing. Finished with fresh basil, Pecorino Romano, and a drizzle of honey.',
      },
      {
        name: 'Belly Beans',
        description: 'Slow-cooked baked beans loaded with smoky pork belly, fire-roasted peppers, and caramelized onions — simmered in our sweet & tangy BBQ sauce with a balsamic reduction finish.',
      },
      {
        name: 'Smoke & Cacio',
        description: 'Our mac n\' cheese reimagined: al dente pasta smothered in a luscious blend of smoked cheeses, creamy béchamel, and a touch of sharp Pecorino Romano.',
      },
    ],
  },
]

const PIZZAS = [
  {
    name: 'Marinara',
    note: 'no cheese',
    description: 'For the purists — San Marzano tomato sauce, slivers of garlic, oregano, and a touch of sea salt, fired to perfection. Simple, bold, old-world flavor.',
  },
  {
    name: 'Margherita',
    description: 'The soul of Naples in every bite — San Marzano tomato sauce, fresh basil, creamy mozzarella, and a drizzle of extra virgin olive oil, straight from the fire.',
  },
  {
    name: 'Hot \'Roni',
    description: 'A loaded pepperoni lover\'s dream — San Marzano tomato sauce, crispy charred pepperoni piled high, hit with a drizzle of spicy honey for the perfect mix of heat and sweet.',
  },
  {
    name: 'Holy Smoke',
    description: 'Slow-smoked Texas brisket, caramelized onions, and creamy mozzarella — kissed with our signature mustard crema. A perfect balance of smoke, sweet, and tangy heat.',
  },
  {
    name: 'The Outlaw',
    description: 'A Texas classic turned pizza masterpiece — fire-roasted jalapeño cheddar sausage, charred red peppers, San Marzano tomato sauce, and smoked mozzarella. Just the right kick.',
  },
  {
    name: 'The Filthy Animal',
    description: 'Robust San Marzano BBQ sauce, crispy pork belly, fire-roasted pineapple, and pickled jalapeños — smoky, sweet, and spicy. You\'re welcome.',
  },
  {
    name: 'Nonna\'s Ransom',
    description: 'Thin-sliced prosciutto, fresh arugula, and a rich caramelized onion & fig base — drizzled with balsamic reduction. A showstopper.',
  },
  {
    name: 'Capo di Fuego',
    description: 'Fire-roasted eggplant, smoked mozzarella, and sweet roasted red peppers on a basil pesto base. Finished with aged balsamic — smoky, rich, and full of Italian soul.',
  },
]

const DESSERTS = [
  {
    name: 'Princess Peach',
    description: 'Flaky, golden puff pastry dusted with cinnamon sugar, topped with wood-fired poached peaches and a sweet mascarpone crema. Light, buttery, and royally delicious.',
  },
  {
    name: 'Kenny\'s Cheesecake',
    description: 'Rich, velvety New York cheesecake topped with a fire-roasted fruit compote — a deep, smoky-sweet contrast to every bite. Classic indulgence with a kiss of the flame.',
  },
  {
    name: 'Campfire Caruso',
    description: 'Golden, egg-washed pizza dough stuffed with melty dark chocolate, toasted marshmallow, and crushed graham crackers. Baked to perfection and oozing with fire-kissed nostalgia.',
  },
]

const COCKTAILS = [
  'Lemoncello Spritz',
  'Strawberry Basil Lemonade',
  'Smoked Mule',
  'Barrel-Aged Old Fashioned',
  'Espresso on Ice',
]

function MenuItem({ name, description, note }) {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--char)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <h4 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--cream)',
          letterSpacing: '-0.1px',
          lineHeight: 1.2,
        }}>
          {name}
        </h4>
        {note && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '1.5px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            border: '1px solid var(--char)',
            padding: '2px 6px',
          }}>
            {note}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: '1rem',
        fontWeight: 300,
        color: 'var(--bone)',
        lineHeight: 1.7,
        fontStyle: 'italic',
      }}>
        {description}
      </p>
    </div>
  )
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('mains')
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
          }
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="py-20 md:py-[120px]"
      style={{ background: 'var(--ash)' }}
    >
      <div className="mx-auto max-w-page px-6 md:px-12">

        <SectionHeader
          kicker={{ left: 'The Menu', right: 'The Menu' }}
          eyebrow="Olive Wood · Hickory · Live Fire · Italian Heritage"
          title="Built by the Fire,"
          accent="Shared at the Table."
          body="Everything on this menu exists because of the fire. The brisket smokes for twelve hours over hickory. The pizza blisters in ninety seconds against live oak flame. The olive wood gives a sweetness that no oven, no broiler, no gas burner has ever replicated. This is the menu the fire makes possible."
        />

        {/* Tabs. Horizontally scrollable on narrow widths so the three
            options never wrap into multiple lines. */}
        <div
          className="reveal reveal-delay-3 flex gap-0 md:gap-[2px] mb-14 overflow-x-auto"
          style={{
            borderBottom: '1px solid var(--char)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--ember)' : '2px solid transparent',
                marginBottom: '-1px',
                padding: '14px 28px',
                minHeight: '44px', /* touch target */
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: activeTab === tab.id ? 'var(--ember-glow)' : 'var(--bone)',
                opacity: activeTab === tab.id ? 1 : 0.7, /* up from 0.55 — bone @ 0.55 = 4.4:1, fails AA */
                transition: 'color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.95' } }}
              onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.opacity = '0.7' } }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAINS & SIDES — 3 cols on lg+, 2 cols on md, 1 col below md */}
        {activeTab === 'mains' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px]">
            {MAINS.map((col) => (
              <div key={col.section} style={{
                background: 'rgba(15, 13, 11, 0.4)',
                border: '1px solid var(--char)',
                padding: '40px 32px',
              }}>
                <div aria-hidden="true" style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '3px',
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}>
                  —
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--cream)',
                  marginBottom: '8px',
                  letterSpacing: '-0.2px',
                }}>
                  {col.section}
                </h3>
                <div style={{ height: '1px', background: 'var(--ember)', marginBottom: '0', opacity: 0.4 }} />
                {col.items.map(item => (
                  <MenuItem key={item.name} {...item} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PIZZA — 2 cols on md+, 1 col below */}
        {activeTab === 'pizza' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
              {PIZZAS.map(pizza => (
                <div key={pizza.name} style={{
                  background: 'rgba(15, 13, 11, 0.4)',
                  border: '1px solid var(--char)',
                  padding: '28px 28px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(45, 41, 37, 0.6)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 13, 11, 0.4)'}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--cream)',
                      letterSpacing: '-0.1px',
                    }}>
                      {pizza.name}
                    </h4>
                    {pizza.note && (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        letterSpacing: '1.5px',
                        color: 'var(--gold)',
                        textTransform: 'uppercase',
                        border: '1px solid var(--char)',
                        padding: '2px 6px',
                      }}>
                        {pizza.note}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    color: 'var(--bone)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                  }}>
                    {pizza.description}
                  </p>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '1.5px',
              marginTop: '24px',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}>
              All pies hand-stretched and fired to order in our wood-fired oven.
            </p>
          </div>
        )}

        {/* DESSERTS & COCKTAILS — 1.5fr / 1fr on md+, stacked below */}
        {activeTab === 'desserts' && (
          <div
            className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-[2px] items-start"
          >
            {/* Desserts */}
            <div style={{
              background: 'rgba(15, 13, 11, 0.4)',
              border: '1px solid var(--char)',
              padding: '40px 32px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '3px',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                —
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--cream)',
                marginBottom: '8px',
              }}>
                Desserts
              </h3>
              <div style={{ height: '1px', background: 'var(--ember)', marginBottom: '0', opacity: 0.4 }} />
              {DESSERTS.map(item => (
                <MenuItem key={item.name} {...item} />
              ))}
            </div>

            {/* Cocktails */}
            <div style={{
              background: 'rgba(15, 13, 11, 0.4)',
              border: '1px solid var(--char)',
              padding: '40px 32px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '3px',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                —
              </div>
              <h3 style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--cream)',
                marginBottom: '8px',
              }}>
                Cocktails
              </h3>
              <div style={{ height: '1px', background: 'var(--ember)', marginBottom: '24px', opacity: 0.4 }} />
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
                {COCKTAILS.map(cocktail => (
                  <li key={cocktail} style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: 'var(--bone)',
                    padding: '18px 0',
                    borderBottom: '1px solid var(--char)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    letterSpacing: '0.2px',
                  }}>
                    <span style={{ color: 'var(--ember-glow)', fontSize: '11px', flexShrink: 0 }}>—</span>
                    {cocktail}
                  </li>
                ))}
              </ul>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--muted)',
                letterSpacing: '1.5px',
                marginTop: '20px',
                textTransform: 'uppercase',
                lineHeight: 1.6,
              }}>
                Cocktail service available on request. Ask about bar add-ons when booking.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
