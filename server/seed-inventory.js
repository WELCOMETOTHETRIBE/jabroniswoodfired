require('dotenv').config({ path: '../.env' });
const pool = require('./db');

const items = [
  // PROTEINS
  { name: 'Whole Packer Brisket',        category: 'PROTEINS',                   unit: 'lbs',     par_level: 15 },
  { name: 'Bone-In Pork Shoulder',        category: 'PROTEINS',                   unit: 'lbs',     par_level: 10 },
  { name: 'Pork Belly (skinless)',         category: 'PROTEINS',                   unit: 'lbs',     par_level: 6  },
  { name: 'Whole Chickens',               category: 'PROTEINS',                   unit: 'each',    par_level: 4  },
  { name: 'Turkey Breasts',               category: 'PROTEINS',                   unit: 'each',    par_level: 2  },
  { name: 'Prosciutto di Parma',          category: 'PROTEINS',                   unit: 'lbs',     par_level: 1  },
  { name: 'Jalapeño Cheddar Sausage',     category: 'PROTEINS',                   unit: 'lbs',     par_level: 2  },
  { name: 'Cup-and-Char Pepperoni (Ezzo)',category: 'PROTEINS',                   unit: 'lbs',     par_level: 2  },

  // PRODUCE
  { name: 'Fresh Garlic',                 category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Yellow Onion',                 category: 'PRODUCE',                    unit: 'lbs',     par_level: 5  },
  { name: 'Red Onion',                    category: 'PRODUCE',                    unit: 'lbs',     par_level: 3  },
  { name: 'Green Cabbage',                category: 'PRODUCE',                    unit: 'lbs',     par_level: 4  },
  { name: 'Purple Cabbage',               category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Carrots',                      category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Fennel Bulb',                  category: 'PRODUCE',                    unit: 'each',    par_level: 4  },
  { name: 'Zucchini',                     category: 'PRODUCE',                    unit: 'lbs',     par_level: 3  },
  { name: 'Japanese Eggplant',            category: 'PRODUCE',                    unit: 'lbs',     par_level: 3  },
  { name: 'Bell Peppers (Red)',            category: 'PRODUCE',                    unit: 'lbs',     par_level: 3  },
  { name: 'Bell Peppers (Yellow)',         category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Broccolini',                   category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Fresh Basil',                  category: 'PRODUCE',                    unit: 'oz',      par_level: 4  },
  { name: 'Fresh Rosemary',               category: 'PRODUCE',                    unit: 'oz',      par_level: 2  },
  { name: 'Fresh Thyme',                  category: 'PRODUCE',                    unit: 'oz',      par_level: 2  },
  { name: 'Fresh Mint',                   category: 'PRODUCE',                    unit: 'oz',      par_level: 1  },
  { name: 'Fresh Arugula',                category: 'PRODUCE',                    unit: 'oz',      par_level: 4  },
  { name: 'Lemons',                       category: 'PRODUCE',                    unit: 'each',    par_level: 12 },
  { name: 'Fresh Peaches',                category: 'PRODUCE',                    unit: 'each',    par_level: 12 },
  { name: 'Fresh Pineapple',              category: 'PRODUCE',                    unit: 'each',    par_level: 2  },
  { name: 'Fresh Jalapeños',              category: 'PRODUCE',                    unit: 'lbs',     par_level: 1  },
  { name: 'Fresh Strawberries',           category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },
  { name: 'Cherry Tomatoes',              category: 'PRODUCE',                    unit: 'lbs',     par_level: 2  },

  // DAIRY & CHEESE
  { name: 'Fior di Latte Mozzarella',     category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 3   },
  { name: 'Smoked Mozzarella',            category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 2   },
  { name: 'Pecorino Romano',              category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 1   },
  { name: 'Parmigiano Reggiano',          category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 1   },
  { name: 'Smoked Gouda',                 category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 2   },
  { name: 'Sharp Smoked Cheddar',         category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 1   },
  { name: 'Mascarpone',                   category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 1   },
  { name: 'Cream Cheese',                 category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 2   },
  { name: 'Sour Cream',                   category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 0.5 },
  { name: 'Unsalted Butter',              category: 'DAIRY & CHEESE',             unit: 'lbs',     par_level: 2   },
  { name: 'Whole Milk',                   category: 'DAIRY & CHEESE',             unit: 'gallons', par_level: 1   },
  { name: 'Heavy Cream',                  category: 'DAIRY & CHEESE',             unit: 'quarts',  par_level: 2   },
  { name: 'Eggs',                         category: 'DAIRY & CHEESE',             unit: 'each',    par_level: 24  },

  // DRY GOODS
  { name: 'Tipo "00" Flour',              category: 'DRY GOODS',                  unit: 'lbs',     par_level: 10 },
  { name: 'All-Purpose Flour',            category: 'DRY GOODS',                  unit: 'lbs',     par_level: 5  },
  { name: 'Panko Breadcrumbs',            category: 'DRY GOODS',                  unit: 'lbs',     par_level: 1  },
  { name: 'Graham Crackers',              category: 'DRY GOODS',                  unit: 'lbs',     par_level: 1  },
  { name: 'Cavatappi Pasta',              category: 'DRY GOODS',                  unit: 'lbs',     par_level: 5  },
  { name: 'Dried Navy Beans',             category: 'DRY GOODS',                  unit: 'lbs',     par_level: 3  },
  { name: 'Active Dry Yeast',             category: 'DRY GOODS',                  unit: 'oz',      par_level: 4  },
  { name: 'Puff Pastry Sheets (frozen)',  category: 'DRY GOODS',                  unit: 'sheets',  par_level: 4  },
  { name: 'Dark Chocolate 70%+',          category: 'DRY GOODS',                  unit: 'lbs',     par_level: 1  },
  { name: 'Large Marshmallows',           category: 'DRY GOODS',                  unit: 'lbs',     par_level: 1  },
  { name: 'Pine Nuts',                    category: 'DRY GOODS',                  unit: 'oz',      par_level: 4  },
  { name: 'Fig Jam (Black Mission)',      category: 'DRY GOODS',                  unit: 'oz',      par_level: 8  },

  // SWEETENERS
  { name: 'Brown Sugar',                  category: 'SWEETENERS',                 unit: 'lbs',     par_level: 2   },
  { name: 'Granulated Sugar',             category: 'SWEETENERS',                 unit: 'lbs',     par_level: 2   },
  { name: 'Powdered Sugar',               category: 'SWEETENERS',                 unit: 'lbs',     par_level: 1   },
  { name: 'Demerara Sugar',               category: 'SWEETENERS',                 unit: 'lbs',     par_level: 0.5 },
  { name: 'Wildflower Honey',             category: 'SWEETENERS',                 unit: 'lbs',     par_level: 1   },

  // SPICES & SEASONINGS
  { name: 'Kosher Salt',                  category: 'SPICES & SEASONINGS',        unit: 'lbs',     par_level: 3  },
  { name: 'Fine Sea Salt',                category: 'SPICES & SEASONINGS',        unit: 'lbs',     par_level: 1  },
  { name: 'Flaky Sea Salt (Maldon)',      category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Coarse Black Pepper',          category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 8  },
  { name: 'White Pepper',                 category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Red Pepper Flakes',            category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Garlic Powder',                category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Granulated Garlic',            category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Onion Powder',                 category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Smoked Paprika',               category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 6  },
  { name: 'Cayenne Pepper',               category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Dry Mustard Powder',           category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 3  },
  { name: 'Cumin',                        category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Nutmeg (whole)',               category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 1  },
  { name: 'Cinnamon (ground)',             category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Dried Sicilian Oregano',       category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 3  },
  { name: 'Bay Leaves',                   category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 1  },
  { name: 'Vanilla Extract',              category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 4  },
  { name: 'Vanilla Beans',               category: 'SPICES & SEASONINGS',        unit: 'each',    par_level: 4  },
  { name: 'Activated Charcoal',           category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Espresso Powder (coarse)',      category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 3  },
  { name: 'Porcini Mushroom Powder',      category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },
  { name: 'Shiitake Mushroom Powder',     category: 'SPICES & SEASONINGS',        unit: 'oz',      par_level: 2  },

  // OILS, VINEGARS & CONDIMENTS
  { name: 'Extra Virgin Olive Oil',       category: 'OILS, VINEGARS & CONDIMENTS', unit: 'quarts',  par_level: 2  },
  { name: 'Apple Cider Vinegar',          category: 'OILS, VINEGARS & CONDIMENTS', unit: 'quarts',  par_level: 1  },
  { name: 'White Vinegar',                category: 'OILS, VINEGARS & CONDIMENTS', unit: 'quarts',  par_level: 1  },
  { name: 'Aged Balsamic Vinegar (12yr+)',category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 16 },
  { name: 'Whole Grain Dijon Mustard',    category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 8  },
  { name: 'Yellow Mustard',               category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 8  },
  { name: 'Dijon Mustard',                category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 4  },
  { name: 'Smoky BBQ Sauce',              category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 32 },
  { name: 'Hot Sauce',                    category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 8  },
  { name: 'Calabrian Chili Paste',        category: 'OILS, VINEGARS & CONDIMENTS', unit: 'oz',      par_level: 4  },
  { name: 'San Marzano DOP Tomatoes (canned)', category: 'OILS, VINEGARS & CONDIMENTS', unit: 'cans', par_level: 12 },
  { name: 'Chicken/Pork Stock',           category: 'OILS, VINEGARS & CONDIMENTS', unit: 'quarts',  par_level: 4  },
  { name: 'Simple Syrup',                 category: 'OILS, VINEGARS & CONDIMENTS', unit: 'quarts',  par_level: 1  },

  // BAR
  { name: 'Limoncello',                   category: 'BAR',                        unit: 'bottles', par_level: 2 },
  { name: 'Prosecco',                     category: 'BAR',                        unit: 'bottles', par_level: 4 },
  { name: 'Mezcal',                       category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Vodka',                        category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Bourbon',                      category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Rye Whiskey',                  category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Angostura Bitters',            category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Orange Bitters',               category: 'BAR',                        unit: 'bottles', par_level: 1 },
  { name: 'Ginger Beer',                  category: 'BAR',                        unit: 'cases',   par_level: 1 },
  { name: 'Club Soda / Sparkling Water',  category: 'BAR',                        unit: 'cases',   par_level: 2 },
  { name: 'Dry White Wine',               category: 'BAR',                        unit: 'bottles', par_level: 2 },
  { name: 'Espresso Beans',               category: 'BAR',                        unit: 'lbs',     par_level: 1 },
  { name: 'Candied Ginger',               category: 'BAR',                        unit: 'oz',      par_level: 4 },

  // WOOD & FIRE
  { name: 'Hickory Wood',                 category: 'WOOD & FIRE',                unit: 'lbs',     par_level: 50 },
  { name: 'Olive Wood',                   category: 'WOOD & FIRE',                unit: 'lbs',     par_level: 30 },
  { name: 'Live Oak',                     category: 'WOOD & FIRE',                unit: 'lbs',     par_level: 30 },
  { name: 'Butcher Paper',                category: 'WOOD & FIRE',                unit: 'rolls',   par_level: 2  },
];

async function seed() {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) FROM inventory');
    const count = parseInt(rows[0].count, 10);

    if (count > 0) {
      console.log(`✓ inventory already seeded (${count} items) — skipping`);
      return;
    }

    for (const item of items) {
      await pool.query(
        `INSERT INTO inventory (name, category, unit, quantity, par_level)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO NOTHING`,
        [item.name, item.category, item.unit, 0, item.par_level]
      );
    }

    console.log(`✓ Seeded ${items.length} inventory items`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
