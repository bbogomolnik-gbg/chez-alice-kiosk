import { useState, useEffect, useRef, useCallback } from "react";

// ─── Image base URL ─────────────────────────────────────────────────────────
const IMG = "https://chezalicecafe.com/images/webp";

// ─── Modifier Master Lists ──────────────────────────────────────────────────
const BREAD_OPTIONS = [
  { id: "bread_multigrain", name: "Multigrain", price: 0 },
  { id: "bread_asiago", name: "Asiago", price: 0 },
  { id: "bread_baguette", name: "Baguette", price: 0 },
  { id: "bread_brioche_bun", name: "Brioche Bun", price: 0 },
  { id: "bread_cinnamon_raisin_bagel", name: "Cinn Raisin Bagel", price: 2.00 },
  { id: "bread_croissant", name: "Croissant", price: 2.00 },
  { id: "bread_everything_bagel", name: "Everything Bagel", price: 2.00 },
  { id: "bread_focaccia", name: "Focaccia", price: 0 },
  { id: "bread_gluten_free", name: "Gluten Free", price: 3.00 },
  { id: "bread_lettuce_wrap", name: "Lettuce Wrap", price: 0 },
  { id: "bread_olive_sourdough", name: "Olive Sourdough", price: 0 },
  { id: "bread_pane_rustica", name: "Pane Rustica", price: 0 },
  { id: "bread_parian_health", name: "Parian Health", price: 1.00 },
  { id: "bread_plain_bagel", name: "Plain Bagel", price: 2.00 },
  { id: "bread_potato_garlic", name: "Potato Garlic", price: 1.00 },
  { id: "bread_rustica_garlic", name: "Rustica Garlic", price: 1.00 },
  { id: "bread_rye", name: "Rye", price: 0 },
  { id: "bread_sesame_bagel", name: "Sesame Bagel", price: 2.00 },
  { id: "bread_sesame_sourdough", name: "Sesame Sourdough", price: 0 },
  { id: "bread_sliced_brioche", name: "Sliced Brioche", price: 0 },
  { id: "bread_sourdough", name: "Sourdough", price: 0 },
  { id: "bread_white", name: "White", price: 0 },
];

const QUICK_MODS = [
  { id: "mod_cold", name: "Cold", price: 0 },
  { id: "mod_hot", name: "Hot", price: 0 },
  { id: "mod_no_make", name: "No Make", price: 0 },
  { id: "mod_to_go_cup", name: "To Go Cup", price: 0 },
  { id: "mod_to_go", name: "To Go", price: 0 },
  { id: "mod_add_avocado", name: "Add Avocado", price: 1.50 },
  { id: "mod_add_grilled_chicken", name: "Add Grilled Chicken", price: 2.00 },
  { id: "mod_lettuce", name: "Lettuce", price: 0 },
  { id: "mod_mayo", name: "Mayo", price: 0 },
  { id: "mod_mustard", name: "Mustard", price: 0 },
  { id: "mod_no_avocado", name: "No Avocado", price: 0 },
  { id: "mod_no_bacon", name: "No Bacon", price: 0 },
  { id: "mod_no_cheese", name: "No Cheese", price: 0 },
  { id: "mod_no_lettuce", name: "No Lettuce", price: 0 },
  { id: "mod_no_onion", name: "No Onion", price: 0 },
  { id: "mod_no_tomato", name: "No Tomato", price: 0 },
  { id: "mod_onion", name: "Onion", price: 0 },
  { id: "mod_pickle", name: "Pickle", price: 0 },
  { id: "mod_sauce_on_side", name: "Sauce On Side", price: 0 },
  { id: "mod_sliced", name: "Sliced", price: 0 },
  { id: "mod_toasted", name: "Toasted", price: 0 },
  { id: "mod_tomato", name: "Tomato", price: 0 },
];

const MOD_MASTER = { bread_choice: BREAD_OPTIONS, quick_mods: QUICK_MODS };

// Helper: resolve modifierGroups to addons array for a specific item
function resolveModifiers(modGroups) {
  if (!modGroups) return null;
  const result = [];
  modGroups.forEach(mg => {
    const master = MOD_MASTER[mg.groupId];
    if (!master) return;
    const groupLabel = mg.groupId === "bread_choice" ? "Bread Choice" : "Quick Mods";
    const allowed = mg.allowedIds === "ALL" ? master : master.filter(o => mg.allowedIds.includes(o.id));
    allowed.forEach(o => result.push({ ...o, group: groupLabel }));
  });
  return result.length > 0 ? result : null;
}

// ─── Menu Data (scraped from chezalicecafe.com) ─────────────────────────────
const MENU = {
  croissants: {
    label: "Croissants",
    icon: "🥐",
    items: [
      { id: "c1", name: "Plain", price: 4.00, desc: "Classic buttery French croissant", img: `${IMG}/cro_plain.webp` },
      { id: "c2", name: "Almond", price: 6.00, desc: "Filled with almond cream & topped with sliced almonds", tags: ["TN"], img: `${IMG}/cro_almond.webp` },
      { id: "c3", name: "Pain Au Chocolat", price: 5.50, desc: "Rich dark chocolate batons in laminated dough", img: `${IMG}/cro_pain_au_chocolate.webp` },
      { id: "c4", name: "Berry Croissant", price: 7.00, desc: "Light French vanilla cream with seasonal berries", img: `${IMG}/cro_berry_croissant.webp` },
      { id: "c5", name: "Pistachio", price: 6.50, desc: "Pistachio cream filled, topped with crushed pistachios", tags: ["TN"], img: `${IMG}/cro_pistachio.webp` },
      { id: "c6", name: "Chocolate Almond", price: 6.00, desc: "Dark chocolate & almond cream croissant", tags: ["TN"], img: `${IMG}/cro_chocolate_almond.webp` },
      { id: "c7", name: "Ham & Gruyère", price: 5.50, desc: "Savory croissant with ham & melted Gruyère cheese", img: `${IMG}/cro_ham_gruyere.webp` },
      { id: "c8", name: "Chocolate Pistachio", price: 7.00, desc: "Chocolate & pistachio cream filled croissant", tags: ["TN"], img: `${IMG}/cro_chocolate_pistachio.webp` },
      { id: "c9", name: "Cardamom", price: 5.00, desc: "Aromatic cardamom-spiced laminated pastry", img: `${IMG}/cro_cardamom.webp` },
      { id: "c10", name: "Cheddar & Chives", price: 4.50, desc: "Savory cheddar cheese & fresh chives", img: `${IMG}/cro_cheddar_chives.webp` },
      { id: "c11", name: "Cherry Cheese", price: 6.00, desc: "Cherry compote with cream cheese filling", img: `${IMG}/cro_cherry_cheese.webp` },
      { id: "c12", name: "Pecan Pie Croissant", price: 6.00, desc: "Caramelized pecan filling in flaky pastry", tags: ["TN"], img: `${IMG}/cro_pecan_pie_croissant.webp` },
      { id: "c13", name: "Smoked Salmon", price: 5.50, desc: "Smoked salmon with crème fraîche", img: `${IMG}/cro_smoked_salmon.webp` },
      { id: "c14", name: "Palmier", price: 4.50, desc: "Caramelized puff pastry elephant ear", img: `${IMG}/cro_palmier.webp` },
      { id: "c15", name: "Blueberry Scone", price: 4.00, desc: "Fresh blueberry buttermilk scone", img: `${IMG}/cro_blueberry_scone.webp` },
      { id: "c16", name: "Cheese Danish", price: 5.00, desc: "Flaky Danish pastry with cream cheese filling", img: `${IMG}/cro_cheese_danish.webp` },
      { id: "c17", name: "Cinnamon Monkey Bread", price: 5.00, desc: "Cinnamon sugar pull-apart bread", img: `${IMG}/cro_cinnamon_monkey_bread.webp` },
      { id: "c18", name: "Croissant du Levant", price: 6.00, desc: "Middle Eastern-inspired croissant", img: `${IMG}/cro_croissant_du_levant.webp` },
      { id: "c19", name: "Mushroom & Mascarpone", price: 5.00, desc: "Savory mushroom and mascarpone filling", img: `${IMG}/cro_mushroom_mascarpone.webp` },
      { id: "c20", name: "Onion, Anchovy & Olive", price: 5.00, desc: "Mediterranean-inspired savory croissant", img: `${IMG}/cro_onion_anchovy_olive.webp` },
      { id: "c21", name: "Pain Au Cranberry", price: 4.50, desc: "Tart cranberry filled croissant", img: `${IMG}/cro_pain_au_cranberry.webp` },
      { id: "c22", name: "Roasted Pear Fromage Blanc Danish", price: 5.00, desc: "Roasted pear with fromage blanc cream", img: `${IMG}/cro_roasted_pear_fromage_blanc_danish.webp` },
    ]
  },
  breakfast: {
    label: "Breakfast",
    icon: "🍳",
    items: [
      { id: "b1", name: "Breakfast Sandwich", price: 9.00, desc: "Two eggs & American cheese on your choice of bread", img: `${IMG}/bft_egg_chs_sandwich.webp`, addons: [
        { id: "ba1", name: "Add Bacon", price: 2.00 },
        { id: "ba2", name: "Add Sausage", price: 2.00 },
        { id: "ba3", name: "Add Ham", price: 2.00 },
        { id: "ba4", name: "Add Pork Roll", price: 2.00 },
        { id: "ba5", name: "Sub Bagel", price: 2.00 },
        { id: "ba6", name: "Sub Croissant", price: 2.00 },
      ]},
      { id: "b2", name: "Everything Bagel", price: 2.50, desc: "Enriched wheat with everything seasoning", tags: ["G","D","S"], img: `${IMG}/bft_everything_bagel.webp` },
      { id: "b3", name: "Plain Bagel", price: 3.00, desc: "Classic enriched wheat bagel", tags: ["G","D","S"], img: `${IMG}/bft_plain_bagel.webp` },
      { id: "b4", name: "Jerusalem Bagel", price: 3.00, desc: "Traditional Jerusalem-style oval bagel", img: `${IMG}/bft_jerusalem.webp` },
    ]
  },
  lunch: {
    label: "Lunch",
    icon: "🥗",
    items: [
      // ── Salads ──
      { id: "l1", name: "Caesar Salad", price: 11.00, desc: "Romaine, shaved parmesan, croutons with caesar dressing", img: `${IMG}/lun_salad_caesar.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "l4", name: "Chez Alice Salad", price: 12.00, desc: "Mixed greens, seasonal fruit, toasted pecans, aged blue cheese, cider vinaigrette", img: `${IMG}/lun_chez_alice_salad.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "l6", name: "Cobb Salad", price: 13.00, desc: "Greens, bacon, avocado, egg, cherry tomato, cucumber, onion, garbanzo beans, pecorino cheese and Ranch dressing", tags: ["GF"], img: `${IMG}/lun_cobb_salad.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "l5", name: "Chicken Salad", price: 13.00, desc: "Apples, ginger and tarragon", img: `${IMG}/lun_chicken_salad.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "l10", name: "Salmon & Potato Salad", price: 16.00, desc: "Roasted salmon, french fingerling potatoes, green beans, peas, dill sauce", tags: ["GF"], img: `${IMG}/lun_salmon_potato_salad.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "l11", name: "Tuna Salad", price: 12.00, desc: "Red onions, celery, lettuce & tomato", img: `${IMG}/lun_tuna_salad.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      { id: "lf6", name: "Salade Niçoise", price: 16.00, desc: "Dry tuna, green beans, hard boiled eggs, black olives, tomatoes, mixed greens with mustard vinaigrette", tags: ["GF"], img: `${IMG}/lun_salade_nicoise.webp`, section: "Salads", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_no_make","mod_to_go_cup","mod_to_go","mod_add_avocado","mod_add_grilled_chicken","mod_cold","mod_hot","mod_lettuce","mod_mayo","mod_mustard","mod_no_avocado","mod_no_bacon","mod_no_cheese","mod_no_lettuce","mod_no_onion","mod_no_tomato","mod_onion","mod_pickle","mod_sauce_on_side","mod_sliced","mod_toasted","mod_tomato"] }
      ]},
      // ── Sandwiches ──
      { id: "l2", name: "Caprese", price: 12.00, desc: "Tomatoes, fresh mozzarella, arugula, balsamic reduction on focaccia", img: `${IMG}/lun_caprese_sandwich.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_add_avocado","mod_no_cheese","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_onion","mod_no_onion","mod_mayo","mod_mustard","mod_sauce_on_side"] }
      ]},
      { id: "l3", name: "Chez Alice BLT", price: 12.00, desc: "Bacon, lettuce, tomato, pickled cucumbers, avocado, spicy mayonnaise, baguette", img: `${IMG}/lun_blt.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_add_avocado","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_no_bacon","mod_mayo","mod_mustard","mod_sauce_on_side"] }
      ]},
      { id: "l7", name: "Egg Salad Sandwich", price: 11.00, desc: "Classic egg salad sandwich", img: `${IMG}/lun_egg_salad.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_to_go","mod_no_make","mod_sliced","mod_add_avocado","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_onion","mod_no_onion","mod_mayo","mod_mustard","mod_pickle","mod_sauce_on_side"] }
      ]},
      { id: "l8", name: "Grilled Cheese", price: 12.00, desc: "Cheddar & gruyere, tomato jam, brioche", img: `${IMG}/lun_grilled_cheese.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: ["bread_multigrain","bread_asiago","bread_baguette","bread_brioche_bun","bread_focaccia","bread_gluten_free","bread_olive_sourdough","bread_pane_rustica","bread_parian_health","bread_potato_garlic","bread_rustica_garlic","bread_rye","bread_sesame_sourdough","bread_sliced_brioche","bread_sourdough","bread_white"] },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_add_avocado","mod_no_cheese","mod_tomato","mod_no_tomato","mod_mayo","mod_mustard","mod_sauce_on_side"] }
      ]},
      { id: "l9", name: "Roast Beef", price: 15.00, desc: "Cheddar cheese, arugula, mayonnaise on baguette", img: `${IMG}/lun_roast_beef.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_add_avocado","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_onion","mod_no_onion","mod_mayo","mod_mustard","mod_pickle","mod_no_cheese","mod_sauce_on_side"] }
      ]},
      { id: "l12", name: "Turkey & Brie", price: 14.00, desc: "Roasted turkey, bacon, avocado, brie, fig & balsamic mayo on multigrain bread", img: `${IMG}/lun_turkey_brie.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_add_avocado","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_onion","mod_no_onion","mod_mayo","mod_mustard","mod_no_cheese","mod_sauce_on_side"] }
      ]},
      { id: "l13", name: "Vegan Mushroom Banh Mi", price: 12.00, desc: "Roasted mushrooms, pickled vegetables, vegan aioli, baguette", tags: ["V"], img: `${IMG}/lun_vegan_mushroom_banh_mi.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: "ALL" },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_lettuce","mod_no_lettuce","mod_tomato","mod_no_tomato","mod_onion","mod_no_onion","mod_mustard","mod_pickle","mod_sauce_on_side"] }
      ]},
      { id: "lf1", name: "Brie et Beurre", price: 9.00, desc: "Brie and butter on a baguette", img: `${IMG}/lun_brie_et_beurre.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: ["bread_baguette","bread_multigrain","bread_focaccia","bread_olive_sourdough","bread_pane_rustica","bread_sourdough","bread_white","bread_gluten_free"] },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_no_cheese","mod_tomato","mod_no_tomato","mod_sauce_on_side"] }
      ]},
      { id: "lf2", name: "Croque Monsieur", price: 13.00, desc: "Ham and gruyère toasted on white bread topped with béchamel sauce", img: `${IMG}/lun_croque_monsieur.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: ["bread_white","bread_sourdough","bread_multigrain","bread_sliced_brioche","bread_brioche_bun","bread_gluten_free"] },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_no_cheese","mod_mustard","mod_sauce_on_side"] }
      ]},
      { id: "lf3", name: "Jambon et Fromage", price: 13.00, desc: "Ham and brie on a buttered baguette", img: `${IMG}/lun_jambon_et_fromage.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "bread_choice", allowedIds: ["bread_baguette","bread_multigrain","bread_white","bread_sourdough","bread_focaccia","bread_gluten_free"] },
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_toasted","mod_sliced","mod_no_cheese","mod_mustard","mod_pickle","mod_sauce_on_side"] }
      ]},
      { id: "lf4", name: "Quiche Florentine", price: 11.00, desc: "Eggs, spinach, gruyère cheese", tags: ["GF"], img: `${IMG}/lun_quiche_florentine.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_sliced","mod_sauce_on_side","mod_no_cheese"] }
      ]},
      { id: "lf5", name: "Quiche Lorraine", price: 11.00, desc: "Eggs, bacon, swiss cheese, caramelized onions", tags: ["GF"], img: `${IMG}/lun_quiche_lorraine.webp`, section: "Sandwiches", modifierGroups: [
        { groupId: "quick_mods", allowedIds: ["mod_cold","mod_hot","mod_to_go","mod_no_make","mod_sliced","mod_sauce_on_side","mod_no_cheese","mod_no_bacon"] }
      ]},
    ]
  },
  beveragesHot: {
    label: "Hot Drinks",
    icon: "☕",
    items: [
      { id: "bh1", name: "Coffee", desc: "Freshly brewed", sizes: [{ label: "Small", price: 3.00 }, { label: "Large", price: 4.00 }], img: `${IMG}/bev_coffee.webp` },
      { id: "bh2", name: "Espresso", desc: "Rich double shot", sizes: [{ label: "Small", price: 4.00 }, { label: "Large", price: 5.00 }], img: `${IMG}/bev_espresso.webp` },
      { id: "bh3", name: "Americano", desc: "Espresso with hot water", sizes: [{ label: "Small", price: 4.50 }, { label: "Large", price: 5.50 }], img: `${IMG}/bev_americano.webp` },
      { id: "bh4", name: "Café au Lait", desc: "Coffee with steamed milk", sizes: [{ label: "Small", price: 3.50 }, { label: "Large", price: 4.50 }], img: `${IMG}/bev_cafe_au_lait.webp` },
      { id: "bh5", name: "Cappuccino", desc: "Espresso, steamed milk & foam", sizes: [{ label: "Small", price: 5.50 }, { label: "Large", price: 6.50 }], img: `${IMG}/bev_cappuccino.webp` },
      { id: "bh6", name: "Latte", desc: "Espresso with silky steamed milk", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }], img: `${IMG}/bev_latte.webp` },
      { id: "bh7", name: "Mocha", desc: "Espresso, chocolate & steamed milk", sizes: [{ label: "Small", price: 6.50 }, { label: "Large", price: 7.50 }], img: `${IMG}/bev_mocha.webp` },
      { id: "bh8", name: "Chai Latte", desc: "Spiced chai with steamed milk", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }], img: `${IMG}/bev_chai_latte.webp` },
      { id: "bh9", name: "French Hot Chocolate", desc: "Rich European-style sipping chocolate", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }], img: `${IMG}/bev_french_hot_chocolate.webp` },
      { id: "bh10", name: "Macchiato", desc: "Espresso marked with foam", sizes: [{ label: "Small", price: 4.50 }, { label: "Large", price: 5.50 }], img: `${IMG}/bev_macchiato.webp` },
      { id: "bh11", name: "White Mocha", desc: "Espresso with white chocolate & milk", sizes: [{ label: "Small", price: 6.50 }, { label: "Large", price: 7.50 }], img: `${IMG}/bev_white_mocha.webp` },
      { id: "bh12", name: "Tea", desc: "Selection of fine teas", sizes: [{ label: "Small", price: 3.75 }, { label: "Large", price: 4.50 }], img: `${IMG}/bev_tea.webp` },
      { id: "bh13", name: "White Chocolate", desc: "White chocolate hot drink", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }], img: `${IMG}/bev_white_chocolate.webp` },
    ]
  },
  beveragesCold: {
    label: "Cold Drinks",
    icon: "🧊",
    items: [
      { id: "bc1", name: "Iced Coffee", price: 3.75, desc: "Cold brewed & refreshing", img: `${IMG}/bev_iced_coffee.webp` },
      { id: "bc2", name: "Iced Latte", price: 4.50, desc: "Espresso over ice with cold milk", img: `${IMG}/bev_iced_latte.webp` },
      { id: "bc3", name: "Iced Americano", price: 4.25, desc: "Espresso with cold water over ice", img: `${IMG}/bev_iced_americano.webp` },
      { id: "bc4", name: "Iced Espresso", price: 3.50, desc: "Chilled espresso over ice", img: `${IMG}/bev_iced_espresso.webp` },
      { id: "bc5", name: "Iced Café au Lait", price: 4.25, desc: "Coffee with cold milk over ice", img: `${IMG}/bev_iced_cafe_au_lait.webp` },
      { id: "bc6", name: "Iced Cappuccino", price: 5.25, desc: "Iced espresso with cold foam", img: `${IMG}/bev_iced_cappuccino.webp` },
      { id: "bc7", name: "Iced Mocha", price: 5.25, desc: "Chocolate espresso over ice", img: `${IMG}/bev_iced_mocha.webp` },
      { id: "bc8", name: "Iced Macchiato", price: 4.00, desc: "Espresso marked with foam over ice", img: `${IMG}/bev_iced_macchiato.webp` },
      { id: "bc9", name: "Iced Chai Latte", price: 5.25, desc: "Spiced chai over ice", img: `${IMG}/bev_iced_chai_latte.webp` },
      { id: "bc10", name: "Iced White Mocha", price: 5.25, desc: "Iced white chocolate espresso", img: `${IMG}/bev_iced_white_mocha.webp` },
      { id: "bc11", name: "French Iced Chocolate", price: 5.25, desc: "Chilled French chocolate drink", img: `${IMG}/bev_french_iced_chocolate.webp` },
      { id: "bc12", name: "Iced Tea", price: 3.75, desc: "Classic iced tea", img: `${IMG}/bev_iced_tea.webp` },
      { id: "bc13", name: "Lemonade", price: 5.25, desc: "Freshly squeezed lemonade", img: `${IMG}/bev_lemonade.webp` },
      { id: "bc14", name: "Hibiscus Iced Tea", price: 5.25, desc: "Vibrant hibiscus flower tea", img: `${IMG}/bev_hibiscus_iced_tea.webp` },
      { id: "bc15", name: "Butterfly Blue Rose Iced Tea", price: 5.25, desc: "Color-changing blue rose tea", img: `${IMG}/bev_butterfly_blue_rose_iced_tea.webp` },
      { id: "bc16", name: "Apple Mint Lavender Iced Tea", price: 5.25, desc: "Apple, mint & lavender infusion", img: `${IMG}/bev_apple_mint_lavender_iced_tea.webp` },
      { id: "bc17", name: "Juices", price: 4.00, desc: "Ask about today's selection", img: `${IMG}/bev_juices.webp` },
      { id: "bc18", name: "Soda", price: 3.50, desc: "Assorted sodas", img: `${IMG}/bev_soda.webp` },
      { id: "bc19", name: "Water", price: 4.00, desc: "Still or sparkling", img: `${IMG}/bev_water.webp` },
    ]
  },
  macarons: {
    label: "Macarons",
    icon: "🌈",
    items: [
      { id: "m1", name: "Birthday Cake", desc: "Almond shell with funfetti sprinkles, vanilla buttercream filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_birthday_cake.webp` },
      { id: "m2", name: "Chocolate", desc: "Chocolate shell with chocolate nibs, dark chocolate ganache filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_choc.webp` },
      { id: "m3", name: "Pistachio", desc: "Almond shell dipped in dark chocolate and topped with sea salt, pistachio cream filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_pistachio.webp` },
      { id: "m4", name: "Salted Caramel", desc: "Almond shell dusted with nougat, caramel ganache, soft caramel, and sea salt filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_salted_caramel.webp` },
      { id: "m5", name: "Raspberry", desc: "Almond shell dipped in raspberry cream, raspberry jam filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_raspberry.webp` },
      { id: "m6", name: "Lavender", desc: "Almond shell with lavender blossoms, lavender buttercream filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_lavender.webp` },
      { id: "m7", name: "Lemon", desc: "Almond shell, lemon cream filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_lemon.webp` },
      { id: "m8", name: "Tiramisu", desc: "Coffee shell dusted with cocoa powder, mascarpone filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_tiramisu.webp` },
      { id: "m9", name: "Strawberry", desc: "Almond shell with strawberry crisps, strawberry buttercream filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_strawberry.webp` },
      { id: "m10", name: "Dulce de Leche", desc: "Almond shell, dulce de leche filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_dulce_de_leche.webp` },
      { id: "m11", name: "Hazelnut", desc: "Almond shell, hazelnut ganache filling", tags: ["GF","TN"], macaron: true, img: `${IMG}/macaron_hazelnut.webp` },
      { id: "m12", name: "Chocolate Blood Orange", desc: "Almond shell with chocolate and orange ganache filling", tags: ["GF"], macaron: true, img: `${IMG}/macaron_choc_blood_orange.webp` },
      { id: "m13", name: "Tropical Mango & Passionfruit", desc: "Tropical mango and passionfruit macaron", tags: ["GF"], macaron: true, img: `${IMG}/macaron_tropical_mango_passionfruit.webp` },
    ]
  },
  patisserie: {
    label: "Pâtisserie",
    icon: "🎂",
    items: [
      { id: "p1", name: "Chocolate Éclair", price: 8.00, desc: "Filled with chocolate pastry cream, topped with a dark chocolate glaze, decorated with a chocolate fan", img: `${IMG}/pat_chocolate_eclair.webp` },
      { id: "p2", name: "Rose Éclair", price: 8.00, desc: "Raspberry confit, rose pastry cream, fresh raspberries topped with white glaze, rose candy, and dried rose petals", img: `${IMG}/pat_rose_eclair.webp` },
      { id: "p3", name: "Raspberry Napoleon", price: 8.00, desc: "Caramelized puff pastry, raspberry pastry cream, raspberry gel", img: `${IMG}/pat_raspberry_napoleon.webp` },
      { id: "p4", name: "Vanilla Napoleon", price: 8.00, desc: "Caramelized puff pastry, vanilla pastry cream", img: `${IMG}/pat_vanilla_napoleon.webp` },
      { id: "p5", name: "Parisian Flan", price: 9.00, desc: "French baked vanilla custard", img: `${IMG}/pat_parisian_flan.webp` },
      { id: "p6", name: "Tiramisu", price: 9.00, desc: "Mascarpone, ladyfingers, coffee & dark rum", img: `${IMG}/pat_tiramisu.webp` },
      { id: "p7", name: "Cassis", price: 9.00, desc: "Black currant mousse cake", tags: ["TN"], img: `${IMG}/pat_cassis.webp` },
      { id: "p8", name: "Opera", price: 9.00, desc: "Almond flour, coffee extract, heavy cream, dark chocolate layers", tags: ["TN"], img: `${IMG}/pat_opera.webp` },
      { id: "p9", name: "Lemon Blueberry", price: 11.00, desc: "Lemon cake, blueberry compote, lemon mousse, lemon macaron", img: `${IMG}/pat_lemon_blueberry.webp` },
      { id: "p10", name: "Chocolate Pear", price: 11.00, desc: "Chocolate & poached pear mousse", tags: ["TN"], img: `${IMG}/pat_chocolate_pear.webp` },
      { id: "p11", name: "Black Forest Cherry", price: 11.00, desc: "Three layers of chocolate cake, dark chocolate mousse, sour cherries, chocolate ganache, whipped cream", img: `${IMG}/pat_black_forest_cherry.webp` },
      { id: "p12", name: "Dobosh Torte", price: 12.00, desc: "Layers of soaked rum joconde, caramel ganache and chocolate ganache", tags: ["TN"], img: `${IMG}/pat_dobosh_torte.webp` },
      { id: "p13", name: "Dark Chocolate Flourless", price: 8.00, desc: "Rich flourless chocolate cake", tags: ["GF"], img: `${IMG}/pat_dark_chocolate_flourless.webp` },
      { id: "p14", name: "Ricotta Cheesecake", price: 8.00, desc: "Ricotta cheesecake on a sweet cookie base", img: `${IMG}/pat_ricotta_cheesecake.webp` },
      { id: "p15", name: "Key Lime", price: 9.00, desc: "Graham cracker crust, key lime custard, mascarpone chantilly", img: `${IMG}/pat_key_lime.webp` },
      { id: "p16", name: "Carrot", price: 9.00, desc: "Carrots, pecans, cream cheese frosting", tags: ["TN"], img: `${IMG}/pat_carrot.webp` },
      { id: "p17", name: "Boston Cream Cheesecake", price: 8.00, desc: "Boston cream cheesecake", tags: ["GF"], img: `${IMG}/pat_boston_cream_cheesecake.webp` },
      { id: "p18", name: "Chocolate Peanut Butter Mousse", price: 8.00, desc: "Chocolate peanut butter mousse, chocolate rice cereal crunch", tags: ["GF","PN"], img: `${IMG}/pat_chocolate_peanut_butter_mousse.webp` },
      { id: "p19", name: "Chocolate Raspberry Torte", price: 9.00, desc: "Dark chocolate, fresh raspberries, raspberry preserves", img: `${IMG}/pat_chocolate_raspberry_torte.webp` },
      { id: "p20", name: "Coconut Mousse Cake", price: 8.00, desc: "Almond dacquoise with coconut rum, coconut cream mousse", tags: ["GF","TN"], img: `${IMG}/pat_coconut_mousse_cake.webp` },
      { id: "p21", name: "Dulce De Leche Napoleon", price: 8.00, desc: "Caramelized puff pastry with dulce de leche cream", img: `${IMG}/pat_dulce_de_leche_napoleon.webp` },
      { id: "p22", name: "Financier Rocher", price: 9.00, desc: "Hazelnut cake, salted caramel, milk chocolate hazelnut glaze", img: `${IMG}/pat_financier_rocher.webp` },
      { id: "p23", name: "La Mariée 'The Bride'", price: 9.00, desc: "Vanilla cake soaked with bourbon, vanilla bean crème with vanilla streusel crumble, vanilla Bavarian cream", img: `${IMG}/pat_la_mariee.webp` },
      { id: "p24", name: "La Tasse", price: 11.00, desc: "Espresso mousse, chocolate frangelico cake, hazelnut crunch", img: `${IMG}/pat_la_tasse.webp` },
      { id: "p25", name: "L'éclair au Sirop d'Erable", price: 8.00, desc: "Maple syrup éclair", img: `${IMG}/pat_eclair_sirop_erable.webp` },
      { id: "p26", name: "Mango Mousse", price: 9.00, desc: "Light mango mousse with almond base", tags: ["TN"], img: `${IMG}/pat_mango_mousse.webp` },
      { id: "p27", name: "Mozarttorte", price: 9.00, desc: "Classic Austrian-inspired chocolate torte", img: `${IMG}/pat_mozarttorte.webp` },
      { id: "p28", name: "Pink Passion", price: 9.00, desc: "Passion fruit mousse with almond base", tags: ["TN"], img: `${IMG}/pat_pink_passion.webp` },
      { id: "p29", name: "Sacher Torte", price: 11.00, desc: "Chocolate cake, vanilla rum syrup, apricot cardamom gelée, chocolate apricot crémeux", tags: ["TN"], img: `${IMG}/pat_sacher_torte.webp` },
      { id: "p30", name: "Strawberry Tres Leches", price: 9.00, desc: "Strawberry tres leches cake", tags: ["GF"], img: `${IMG}/pat_strawberry_tres_leches.webp` },
      { id: "p31", name: "Truffon", price: 9.00, desc: "Dark chocolate, cocoa powder, heavy cream, dark rum", img: `${IMG}/pat_truffon.webp` },
    ]
  },
  tarts: {
    label: "Tartlets",
    icon: "🥧",
    items: [
      { id: "t1", name: "Fresh Fruit Tartlet", price: 9.00, desc: "Seasonal fresh fruit & pastry cream in a buttery pastry crust", img: `${IMG}/tart_fresh_fruit.webp` },
      { id: "t2", name: "Lemon Tartlet", price: 9.00, desc: "Lemon curd & toasted meringue in a buttery pastry crust", img: `${IMG}/tart_lemon.webp` },
      { id: "t3", name: "Apple Tartlet", price: 9.00, desc: "Baked apples & apple custard in a delicate crust", img: `${IMG}/tart_apple.webp` },
      { id: "t4", name: "Almondine Tartlet", price: 9.00, desc: "Apricot jam, frangipane, toasted almonds in a delicate crust", tags: ["TN"], img: `${IMG}/tart_almondine.webp` },
      { id: "t5", name: "Pear Tartlet", price: 9.00, desc: "Poached pears, frangipane in a delicate crust", img: `${IMG}/tart_pear.webp` },
    ]
  }
};

const MACARON_PRICES = { "½ Dozen": 16, "Dozen": 31, "Box of 15": 39 };

// ─── Color palette from Chez Alice ──────────────────────────────────────────
const COLORS = {
  cream: "#FAF7F2",
  warmWhite: "#FFFDF9",
  gold: "#C5A258",
  goldLight: "#D4B87A",
  goldDark: "#A68A3E",
  charcoal: "#2C2C2C",
  text: "#3A3A3A",
  textLight: "#6B6B6B",
  rose: "#C4727F",
  rosePale: "#F2E0E3",
  border: "#E8E2D8",
  success: "#5A8F5A",
  danger: "#C4504A",
};

// ─── Flourish SVG (matching website) ────────────────────────────────────────
const Flourish = () => (
  <svg width="60" height="12" viewBox="0 0 60 12" fill="none" style={{ opacity: 0.35 }}>
    <path d="M0 6C10 6 10 1 20 1S30 6 30 6s0 5 10 5 10-5 20-5" stroke={COLORS.gold} strokeWidth="1.2" fill="none"/>
  </svg>
);

// ─── Screens ────────────────────────────────────────────────────────────────
const SCREENS = { WELCOME: 0, MENU: 1, ITEM: 2, CART: 3, CHECKOUT: 4, PAYMENT: 5, CONFIRM: 6 };

// ─── Main App ───────────────────────────────────────────────────────────────
export default function ChezAliceKiosk() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("croissants");
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [animating, setAnimating] = useState(false);
  const [tipPercent, setTipPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const timeoutRef = useRef(null);

  const navigateTo = useCallback((s) => {
    setAnimating(true);
    setTimeout(() => { setScreen(s); setAnimating(false); }, 250);
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tipAmount = cartTotal * tipPercent / 100;
  const tax = cartTotal * 0.06625;
  const ccFee = paymentMethod === "credit" ? (cartTotal + tipAmount + tax) * 0.035 : 0;
  const grandTotal = cartTotal + tipAmount + tax + ccFee;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const key = item.cartKey || item.id;
      const existing = prev.find(c => c.cartKey === key);
      if (existing) return prev.map(c => c.cartKey === key ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, cartKey: key, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cartKey) => {
    setCart(prev => prev.map(c => c.cartKey === cartKey ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const startNewOrder = useCallback(() => {
    setCart([]); setSelectedCategory("croissants"); setSelectedItem(null);
    setCustomerName(""); setTipPercent(0); setOrderNumber(null);
    navigateTo(SCREENS.WELCOME);
  }, [navigateTo]);

  useEffect(() => {
    if (screen === SCREENS.CONFIRM) {
      timeoutRef.current = setTimeout(startNewOrder, 30000);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [screen, startNewOrder]);

  const styles = {
    kiosk: {
      width: "100%", minHeight: "100vh", background: COLORS.cream,
      fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Georgia', serif",
      color: COLORS.text, position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    },
    fadeWrap: {
      flex: 1, display: "flex", flexDirection: "column",
      opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
    }
  };

  return (
    <div style={styles.kiosk}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Josefin+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cartBounce { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        input { font-family: 'Josefin Sans', sans-serif; }
        @media print {
          body * { visibility: hidden; }
          #receipt-section, #receipt-section * { visibility: visible; }
          #receipt-section { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <div style={styles.fadeWrap}>
        {screen === SCREENS.WELCOME && <WelcomeScreen onStart={() => navigateTo(SCREENS.MENU)} />}
        {(screen === SCREENS.MENU || screen === SCREENS.ITEM) && (
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {screen === SCREENS.MENU && (
                <MenuScreen
                  category={selectedCategory} setCategory={setSelectedCategory}
                  onSelectItem={(item) => { setSelectedItem(item); navigateTo(SCREENS.ITEM); }}
                  cart={cart} cartCount={cartCount} cartTotal={cartTotal}
                  onOpenCart={() => navigateTo(SCREENS.CART)}
                  addToCart={addToCart}
                />
              )}
              {screen === SCREENS.ITEM && selectedItem && (
                <ItemDetail
                  item={selectedItem}
                  onBack={() => navigateTo(SCREENS.MENU)}
                  addToCart={addToCart}
                  onOpenCart={() => navigateTo(SCREENS.CART)}
                  cartCount={cartCount} cartTotal={cartTotal}
                />
              )}
            </div>
            <CartSidebar
              cart={cart} cartTotal={cartTotal} tax={tax}
              addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart}
              onCheckout={() => navigateTo(SCREENS.CHECKOUT)}
            />
          </div>
        )}
        {screen === SCREENS.CART && (
          <CartScreen
            cart={cart} cartTotal={cartTotal} tax={tax}
            onBack={() => navigateTo(SCREENS.MENU)}
            addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart}
            onCheckout={() => navigateTo(SCREENS.CHECKOUT)}
          />
        )}
        {screen === SCREENS.CHECKOUT && (
          <CheckoutScreen
            cartTotal={cartTotal} tax={tax} tipPercent={tipPercent} setTipPercent={setTipPercent}
            tipAmount={tipAmount} ccFee={ccFee} grandTotal={grandTotal}
            customerName={customerName} setCustomerName={setCustomerName}
            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
            onBack={() => navigateTo(SCREENS.CART)}
            onPay={() => navigateTo(SCREENS.PAYMENT)}
          />
        )}
        {screen === SCREENS.PAYMENT && (
          <PaymentScreen
            grandTotal={grandTotal} paymentMethod={paymentMethod}
            onBack={() => navigateTo(SCREENS.CHECKOUT)}
            onComplete={() => { setOrderNumber(Math.floor(100 + Math.random() * 900)); navigateTo(SCREENS.CONFIRM); }}
          />
        )}
        {screen === SCREENS.CONFIRM && (
          <ConfirmationScreen
            orderNumber={orderNumber} customerName={customerName} phoneNumber={phoneNumber}
            cart={cart} cartTotal={cartTotal} tax={tax} tipAmount={tipAmount} ccFee={ccFee} grandTotal={grandTotal}
            paymentMethod={paymentMethod} onNewOrder={startNewOrder}
          />
        )}
      </div>
    </div>
  );
}

// ─── Welcome Screen ─────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.warmWhite} 50%, ${COLORS.cream} 100%)`,
      padding: "40px 20px", textAlign: "center", minHeight: "100vh",
    }}>
      <div style={{ animation: "float 4s ease-in-out infinite" }}>
        <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ width: 320, maxWidth: "80%", marginBottom: 20 }}/>
      </div>
      <Flourish />
      <h1 style={{ fontSize: 42, fontWeight: 300, color: COLORS.charcoal, marginTop: 24, letterSpacing: "0.04em", lineHeight: 1.2 }}>Bienvenue</h1>
      <p style={{ fontSize: 17, color: COLORS.textLight, marginTop: 12, maxWidth: 380, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6, letterSpacing: "0.02em" }}>
        Artisanal French pastries, coffee & cuisine<br/>in the heart of Princeton
      </p>
      <button onClick={onStart} style={{
        marginTop: 48, padding: "18px 64px", fontSize: 18, fontWeight: 500,
        fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase",
        background: COLORS.gold, color: "#fff", borderRadius: 0, border: `2px solid ${COLORS.gold}`,
        transition: "all 0.3s ease",
      }}
        onMouseEnter={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.gold; }}
        onMouseLeave={e => { e.target.style.background = COLORS.gold; e.target.style.color = "#fff"; }}
      >Touch to Order</button>
      <p style={{ marginTop: 60, fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        14-16 Witherspoon Street · Princeton, NJ
      </p>
    </div>
  );
}

// ─── Header Bar ─────────────────────────────────────────────────────────────
function HeaderBar({ cartCount, cartTotal, onOpenCart, title }) {
  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(cartCount);
  useEffect(() => {
    if (cartCount > prevCount.current) { setBouncing(true); setTimeout(() => setBouncing(false), 400); }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 24px", background: COLORS.warmWhite,
      borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 50,
    }}>
      <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ height: 72, objectFit: "contain" }}/>
      {title && <span style={{ fontSize: 16, fontWeight: 500, color: COLORS.charcoal, letterSpacing: "0.04em", fontFamily: "'Josefin Sans', sans-serif" }}>{title}</span>}
      <button onClick={onOpenCart} style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
        background: cartCount > 0 ? COLORS.gold : "transparent", borderRadius: 24,
        color: cartCount > 0 ? "#fff" : COLORS.textLight, transition: "all 0.3s ease",
        fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 500,
        animation: bouncing ? "cartBounce 0.4s ease" : "none",
      }}>
        <span style={{ fontSize: 18 }}>🛒</span>
        {cartCount > 0 && <span>{cartCount} · ${cartTotal.toFixed(2)}</span>}
      </button>
    </div>
  );
}

// ─── Category Nav ───────────────────────────────────────────────────────────
function CategoryNav({ selected, onSelect }) {
  const cats = Object.entries(MENU);
  return (
    <div style={{
      display: "flex", gap: 0, overflowX: "auto", background: COLORS.warmWhite,
      borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 69, zIndex: 40,
      scrollbarWidth: "none",
    }}>
      {cats.map(([key, cat]) => (
        <button key={key} onClick={() => onSelect(key)} style={{
          flex: "0 0 auto", padding: "14px 18px", fontSize: 13, fontWeight: selected === key ? 600 : 400,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase",
          color: selected === key ? COLORS.gold : COLORS.textLight, whiteSpace: "nowrap",
          borderBottom: selected === key ? `3px solid ${COLORS.gold}` : "3px solid transparent",
          transition: "all 0.2s ease",
        }}>
          <span style={{ marginRight: 6 }}>{cat.icon}</span>{cat.label}
        </button>
      ))}
    </div>
  );
}

// ─── Menu Screen ────────────────────────────────────────────────────────────
function MenuScreen({ category, setCategory, onSelectItem, cart, cartCount, cartTotal, onOpenCart, addToCart }) {
  const items = MENU[category]?.items || [];
  const sections = items.some(i => i.section);
  const grouped = sections
    ? items.reduce((acc, item) => {
        const sec = item.section || "Other";
        if (!acc.find(g => g.section === sec)) acc.push({ section: sec, items: [] });
        acc.find(g => g.section === sec).items.push(item);
        return acc;
      }, [])
    : [{ section: null, items }];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <HeaderBar cartCount={cartCount} cartTotal={cartTotal} onOpenCart={onOpenCart} />
      <CategoryNav selected={category} onSelect={setCategory} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8, paddingLeft: 8 }}>
          {MENU[category]?.label}
        </h2>
        <div style={{ paddingLeft: 8, marginBottom: 20 }}><Flourish /></div>
        {grouped.map((group, gi) => (
          <div key={group.section || gi}>
            {group.section && (
              <h3 style={{
                fontSize: 20, fontWeight: 400, color: COLORS.gold, marginTop: gi > 0 ? 32 : 0,
                marginBottom: 16, paddingLeft: 8, paddingBottom: 8,
                borderBottom: `1px solid ${COLORS.border}`,
                fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.03em",
              }}>{group.section}</h3>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {group.items.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} onSelect={() => onSelectItem(item)} addToCart={addToCart} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuCard({ item, index, onSelect, addToCart }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const price = item.price || item.sizes?.[0]?.price || (item.macaron ? 16 : 0);
  const priceLabel = item.sizes ? `from $${item.sizes[0].price.toFixed(2)}` : item.macaron ? "from $16.00" : `$${item.price.toFixed(2)}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        background: "#fff", borderRadius: 4, overflow: "hidden",
        border: `1px solid ${hovered ? COLORS.goldLight : COLORS.border}`,
        boxShadow: hovered ? "0 8px 24px rgba(197,162,88,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease", cursor: "pointer",
        animation: `slideUp 0.4s ease ${index * 0.04}s both`,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {item.img && !imgError ? (
        <div style={{ width: "100%", height: 180, overflow: "hidden", background: COLORS.cream }}>
          <img src={item.img} alt={item.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        </div>
      ) : (
        <div style={{ height: 3, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})` }} />
      )}
      <div style={{ padding: "16px 18px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 500, color: COLORS.charcoal, lineHeight: 1.25, marginBottom: 6 }}>{item.name}</h3>
            {item.tags && (
              <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                {item.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 2,
                    background: t === "GF" ? "#E8F5E8" : t === "V" ? "#E8F0E8" : COLORS.rosePale,
                    color: t === "GF" ? COLORS.success : t === "V" ? COLORS.success : COLORS.rose,
                    fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.05em",
                  }}>{t === "GF" ? "Gluten-Free" : t === "TN" ? "Tree Nut" : t === "V" ? "Vegan" : t === "PN" ? "Peanut" : t}</span>
                ))}
              </div>
            )}
            <p style={{
              fontSize: 13, color: COLORS.textLight, lineHeight: 1.5, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>{item.desc}</p>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.gold, whiteSpace: "nowrap", fontFamily: "'Josefin Sans', sans-serif" }}>{priceLabel}</span>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {!item.sizes && !item.macaron && (
            <button onClick={(e) => { e.stopPropagation(); addToCart({ ...item, cartKey: item.id }); }} style={{
              flex: 1, padding: "10px", fontSize: 13, fontWeight: 500,
              fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
              background: COLORS.gold, color: "#fff", borderRadius: 2, transition: "all 0.2s ease",
            }}
              onMouseEnter={e => e.target.style.background = COLORS.goldDark}
              onMouseLeave={e => e.target.style.background = COLORS.gold}
            >Quick Add</button>
          )}
          <button onClick={onSelect} style={{
            flex: 1, padding: "10px", fontSize: 13, fontWeight: 500,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
            background: "transparent", color: COLORS.gold, borderRadius: 2,
            border: `1px solid ${COLORS.gold}`, transition: "all 0.2s ease",
          }}>{item.sizes || item.macaron || item.addons || item.modifierGroups ? "Customize" : "Details"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Detail ────────────────────────────────────────────────────────────
function ItemDetail({ item, onBack, addToCart, onOpenCart, cartCount, cartTotal }) {
  const [selectedSize, setSelectedSize] = useState(item.sizes ? 0 : null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [macaronQty, setMacaronQty] = useState("½ Dozen");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showMods, setShowMods] = useState(false);
  const [itemNote, setItemNote] = useState("");

  const resolvedAddons = item.addons || resolveModifiers(item.modifierGroups);
  const hasGroupedAddons = resolvedAddons && resolvedAddons.some(a => a.group);

  // Auto-open overlay when item has grouped mods
  useEffect(() => { if (hasGroupedAddons) setShowMods(true); }, []);

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => prev.find(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]);
  };

  const getPrice = () => {
    let p = item.price || 0;
    if (item.sizes) p = item.sizes[selectedSize].price;
    if (item.macaron) p = MACARON_PRICES[macaronQty];
    selectedAddons.forEach(a => p += a.price);
    return p;
  };

  const handleAdd = () => {
    const label = [];
    if (item.sizes) label.push(item.sizes[selectedSize].label);
    if (item.macaron) label.push(macaronQty);
    selectedAddons.forEach(a => label.push(a.name));
    if (itemNote.trim()) label.push(`Note: ${itemNote.trim()}`);
    const cartKey = `${item.id}-${label.join("-")}`;
    for (let i = 0; i < qty; i++) {
      addToCart({ id: item.id, name: item.name, price: getPrice(), cartKey, variant: label.join(", ") || null });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <HeaderBar cartCount={cartCount} cartTotal={cartTotal} onOpenCart={onOpenCart} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 100px" }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.rosePale} 0%, ${COLORS.cream} 100%)`,
          padding: item.img && !imgError ? "0" : "40px 24px", textAlign: "center", position: "relative",
        }}>
          <button onClick={onBack} style={{
            position: "absolute", left: 20, top: 20, fontSize: 14,
            color: item.img && !imgError ? "#fff" : COLORS.gold,
            fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.06em",
            zIndex: 10, textShadow: item.img && !imgError ? "0 1px 4px rgba(0,0,0,0.5)" : "none",
          }}>← Back</button>
          {item.img && !imgError ? (
            <div style={{ width: "100%", height: 300, overflow: "hidden" }}>
              <img src={item.img} alt={item.name} onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "60px 24px 24px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
              }}>
                <h1 style={{ fontSize: 32, fontWeight: 400, color: "#fff", marginBottom: 4 }}>{item.name}</h1>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{MENU[Object.keys(MENU).find(k => MENU[k].items.find(i => i.id === item.id))]?.icon}</div>
              <h1 style={{ fontSize: 36, fontWeight: 400, color: COLORS.charcoal, marginBottom: 8 }}>{item.name}</h1>
            </>
          )}
        </div>

        <div style={{ padding: "24px 24px" }}>
          {(!item.img || imgError) && <Flourish />}
          <p style={{ fontSize: 15, color: COLORS.textLight, marginTop: 12, maxWidth: 400, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6 }}>{item.desc}</p>
          {item.tags && (
            <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
              {item.tags.map(t => (
                <span key={t} style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 2,
                  background: t === "GF" ? "#E8F5E8" : t === "V" ? "#E8F0E8" : COLORS.rosePale,
                  color: t === "GF" ? COLORS.success : t === "V" ? COLORS.success : COLORS.rose,
                  fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500,
                }}>{t === "GF" ? "Gluten-Free" : t === "TN" ? "Tree Nut" : t === "V" ? "Vegan" : t === "PN" ? "Peanut" : t}</span>
              ))}
            </div>
          )}

          {item.sizes && (
            <div style={{ marginTop: 28, marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>Select Size</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {item.sizes.map((s, i) => (
                  <button key={i} onClick={() => setSelectedSize(i)} style={{
                    flex: 1, padding: "16px", textAlign: "center", borderRadius: 4,
                    border: `2px solid ${selectedSize === i ? COLORS.gold : COLORS.border}`,
                    background: selectedSize === i ? "rgba(197,162,88,0.06)" : "#fff", transition: "all 0.2s ease",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.charcoal }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>${s.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.macaron && (
            <div style={{ marginTop: 28, marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>Select Quantity</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {Object.entries(MACARON_PRICES).map(([label, price]) => (
                  <button key={label} onClick={() => setMacaronQty(label)} style={{
                    flex: 1, padding: "16px 8px", textAlign: "center", borderRadius: 4,
                    border: `2px solid ${macaronQty === label ? COLORS.gold : COLORS.border}`,
                    background: macaronQty === label ? "rgba(197,162,88,0.06)" : "#fff", transition: "all 0.2s ease",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.charcoal }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>${price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {resolvedAddons && !hasGroupedAddons && (() => {
            const groups = [{ label: "Customize", items: resolvedAddons }];
            return (
              <div style={{ marginTop: 28, marginBottom: 28 }}>
                {groups.map((grp, gi) => (
                  <div key={grp.label}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>{grp.label}</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {grp.items.map(a => {
                        const sel = selectedAddons.find(sa => sa.id === a.id);
                        return (
                          <button key={a.id} onClick={() => toggleAddon(a)} style={{
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            padding: "12px 8px", borderRadius: 4,
                            border: `2px solid ${sel ? COLORS.gold : COLORS.border}`,
                            background: sel ? "rgba(197,162,88,0.06)" : "#fff", transition: "all 0.2s ease", textAlign: "center",
                            minHeight: 60, cursor: "pointer",
                          }}>
                            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.charcoal, lineHeight: 1.2 }}>{a.name}</span>
                            {a.price > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>+${a.price.toFixed(2)}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {hasGroupedAddons && (
            <div style={{ marginTop: 28, marginBottom: 28, textAlign: "center" }}>
              <button onClick={() => setShowMods(true)} style={{
                padding: "14px 40px", fontSize: 14, fontWeight: 500,
                fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
                background: selectedAddons.length > 0 ? COLORS.gold : "transparent",
                color: selectedAddons.length > 0 ? "#fff" : COLORS.gold,
                borderRadius: 4, border: `2px solid ${COLORS.gold}`, cursor: "pointer", transition: "all 0.2s ease",
              }}>
                {selectedAddons.length > 0 ? `${selectedAddons.length} Mod${selectedAddons.length > 1 ? "s" : ""} Selected` : "Customize Mods"}
              </button>
            </div>
          )}

          {showMods && hasGroupedAddons && (() => {
            const groups = [...new Set(resolvedAddons.map(a => a.group))].map(g => ({
              label: g, items: resolvedAddons.filter(a => a.group === g)
            }));
            return (
              <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.5)", zIndex: 1000,
                display: "flex", alignItems: "center", justifyContent: "center",
              }} onClick={() => setShowMods(false)}>
                <div onClick={e => e.stopPropagation()} style={{
                  background: "#fff", borderRadius: 12, padding: "32px 28px 24px",
                  maxWidth: 680, width: "92%", maxHeight: "80vh", overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 400, color: COLORS.charcoal, marginBottom: 4 }}>Customize {item.name}</h2>
                    <Flourish />
                  </div>
                  {/* ── Order Type (Hot/Cold/To Go/No Make) ── */}
                  {(() => {
                    const ORDER_TYPE_IDS = ["mod_hot","mod_cold","mod_to_go","mod_to_go_cup","mod_no_make"];
                    const ORDER_TYPE_COLORS = { mod_hot: "#D32F2F", mod_cold: "#1976D2", mod_to_go: "#388E3C", mod_to_go_cup: "#2E7D32", mod_no_make: "#F57C00" };
                    const orderTypes = resolvedAddons.filter(a => ORDER_TYPE_IDS.includes(a.id));
                    if (orderTypes.length === 0) return null;
                    return (
                      <div style={{
                        border: `2px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20,
                        background: "#FAFAFA",
                      }}>
                        <h3 style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 10, textAlign: "center" }}>Order Type</h3>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                          {orderTypes.map(a => {
                            const sel = selectedAddons.find(sa => sa.id === a.id);
                            const clr = ORDER_TYPE_COLORS[a.id] || COLORS.gold;
                            return (
                              <button key={a.id} onClick={() => toggleAddon(a)} style={{
                                padding: "8px 16px", borderRadius: 20,
                                border: `2px solid ${sel ? clr : COLORS.border}`,
                                background: sel ? clr : "#fff", color: sel ? "#fff" : clr,
                                fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif",
                                letterSpacing: "0.04em", cursor: "pointer", transition: "all 0.2s ease",
                              }}>{a.name}</button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ display: "flex", gap: 0 }}>
                    {groups.map((grp, gi) => {
                      const ORDER_TYPE_IDS = ["mod_hot","mod_cold","mod_to_go","mod_to_go_cup","mod_no_make"];
                      const filteredItems = grp.items.filter(a => !ORDER_TYPE_IDS.includes(a.id));
                      if (filteredItems.length === 0) return null;
                      return (
                        <div key={grp.label} style={{
                          flex: 1, display: "flex", flexDirection: "column",
                          borderRight: gi < groups.length - 1 ? `1px solid ${COLORS.border}` : "none",
                          paddingRight: gi < groups.length - 1 ? 20 : 0,
                          paddingLeft: gi > 0 ? 20 : 0,
                        }}>
                          <h3 style={{
                            fontSize: 12, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif",
                            letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight,
                            marginBottom: 14, textAlign: "center",
                          }}>{grp.label}</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            {filteredItems.map(a => {
                              const sel = selectedAddons.find(sa => sa.id === a.id);
                              return (
                                <button key={a.id} onClick={() => toggleAddon(a)} style={{
                                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                  padding: "10px 6px", borderRadius: 6,
                                  border: `2px solid ${sel ? COLORS.gold : COLORS.border}`,
                                  background: sel ? "rgba(197,162,88,0.08)" : "#fff",
                                  transition: "all 0.2s ease", textAlign: "center",
                                  minHeight: 56, cursor: "pointer",
                                }}>
                                  <span style={{ fontSize: 13, fontWeight: 500, color: sel ? COLORS.gold : COLORS.charcoal, lineHeight: 1.2 }}>{a.name}</span>
                                  {a.price > 0 && <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.gold, marginTop: 3, fontFamily: "'Josefin Sans', sans-serif" }}>+${a.price.toFixed(2)}</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Note ── */}
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 8 }}>Note</h3>
                    <input
                      type="text" placeholder="Add a note (e.g. name, special requests)"
                      value={itemNote} onChange={e => setItemNote(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 14px", fontSize: 14, borderRadius: 6,
                        border: `1px solid ${COLORS.border}`, fontFamily: "'Josefin Sans', sans-serif",
                        outline: "none", transition: "border 0.2s ease",
                      }}
                      onFocus={e => e.target.style.borderColor = COLORS.gold}
                      onBlur={e => e.target.style.borderColor = COLORS.border}
                    />
                  </div>

                  <button onClick={() => setShowMods(false)} style={{
                    display: "block", width: "100%", marginTop: 24, padding: "14px",
                    fontSize: 14, fontWeight: 500, fontFamily: "'Josefin Sans', sans-serif",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    background: COLORS.gold, color: "#fff", borderRadius: 6, border: "none",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}>Done</button>
                </div>
              </div>
            );
          })()}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
              width: 44, height: 44, borderRadius: "50%", border: `2px solid ${COLORS.border}`,
              fontSize: 20, color: COLORS.charcoal, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff",
            }}>−</button>
            <span style={{ fontSize: 28, fontWeight: 500, color: COLORS.charcoal, minWidth: 40, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{
              width: 44, height: 44, borderRadius: "50%", border: `2px solid ${COLORS.gold}`,
              fontSize: 20, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(197,162,88,0.06)",
            }}>+</button>
          </div>

          <button onClick={handleAdd} style={{
            width: "100%", padding: "18px", fontSize: 16, fontWeight: 600,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
            background: added ? COLORS.success : COLORS.gold, color: "#fff", borderRadius: 4, transition: "all 0.3s ease",
          }}>
            {added ? "✓ Added to Order!" : `Add to Order · $${(getPrice() * qty).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Sidebar (right panel) ─────────────────────────────────────────────
function CartSidebar({ cart, cartTotal, tax, addToCart, removeFromCart, clearCart, onCheckout }) {
  if (cart.length === 0) {
    return (
      <div style={{
        width: 340, minWidth: 340, borderLeft: `1px solid ${COLORS.border}`, background: COLORS.warmWhite,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <span style={{ fontSize: 48, marginBottom: 12 }}>🧺</span>
        <h3 style={{ fontSize: 18, fontWeight: 300, color: COLORS.charcoal, marginBottom: 4 }}>Your Order</h3>
        <p style={{ fontSize: 13, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, textAlign: "center" }}>
          Add items from the menu to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{
      width: 340, minWidth: 340, borderLeft: `1px solid ${COLORS.border}`, background: COLORS.warmWhite,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 400, color: COLORS.charcoal }}>Your Order ({cart.reduce((s, i) => s + i.qty, 0)})</h3>
        <button onClick={clearCart} style={{ fontSize: 11, color: COLORS.danger, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Clear</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px" }}>
        {cart.map((item, i) => (
          <div key={item.cartKey} style={{
            padding: "10px 0", borderBottom: i < cart.length - 1 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.charcoal, lineHeight: 1.3 }}>{item.name}</div>
                {item.variant && <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2, fontFamily: "'Josefin Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.variant}</div>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.gold, whiteSpace: "nowrap", fontFamily: "'Josefin Sans', sans-serif" }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <button onClick={() => removeFromCart(item.cartKey)} style={{
                width: 26, height: 26, borderRadius: "50%", border: `1px solid ${COLORS.border}`,
                fontSize: 14, color: COLORS.charcoal, background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>−</button>
              <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => addToCart({ ...item })} style={{
                width: 26, height: 26, borderRadius: "50%", border: `1px solid ${COLORS.gold}`,
                fontSize: 14, color: COLORS.gold, background: "rgba(197,162,88,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif" }}>Subtotal</span>
          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Josefin Sans', sans-serif" }}>${cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif" }}>Tax</span>
          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Josefin Sans', sans-serif" }}>${tax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: COLORS.charcoal }}>Total</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif" }}>${(cartTotal + tax).toFixed(2)}</span>
        </div>
        <button onClick={onCheckout} style={{
          width: "100%", padding: "14px", fontSize: 13, fontWeight: 600,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
          background: COLORS.gold, color: "#fff", borderRadius: 4, transition: "all 0.2s ease",
        }}>Checkout</button>
      </div>
    </div>
  );
}

// ─── Cart Screen ────────────────────────────────────────────────────────────
function CartScreen({ cart, cartTotal, tax, onBack, addToCart, removeFromCart, clearCart, onCheckout }) {
  if (cart.length === 0) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ width: 240, maxWidth: "70%", objectFit: "contain", marginBottom: 24 }}/>
        <span style={{ fontSize: 64, marginBottom: 20 }}>🧺</span>
        <h2 style={{ fontSize: 28, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8 }}>Your Order is Empty</h2>
        <Flourish />
        <p style={{ fontSize: 15, color: COLORS.textLight, marginTop: 12, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>Browse our menu to start your order</p>
        <button onClick={onBack} style={{
          marginTop: 32, padding: "14px 48px", fontSize: 14, fontWeight: 500,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: COLORS.gold, color: "#fff", borderRadius: 2,
        }}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.warmWhite,
      }}>
        <button onClick={onBack} style={{ fontSize: 14, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500 }}>← Menu</button>
        <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ height: 72, objectFit: "contain" }}/>
        <button onClick={clearCart} style={{ fontSize: 12, color: COLORS.danger, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Clear All</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {cart.map((item, i) => (
          <div key={item.cartKey} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 0", borderBottom: i < cart.length - 1 ? `1px solid ${COLORS.border}` : "none",
            animation: `slideUp 0.3s ease ${i * 0.05}s both`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 500, color: COLORS.charcoal }}>{item.name}</div>
              {item.variant && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2, fontFamily: "'Josefin Sans', sans-serif" }}>{item.variant}</div>}
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>${item.price.toFixed(2)} each</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => removeFromCart(item.cartKey)} style={{
                width: 32, height: 32, borderRadius: "50%", border: `1px solid ${COLORS.border}`,
                fontSize: 16, color: COLORS.charcoal, background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>−</button>
              <span style={{ fontSize: 17, fontWeight: 500, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => addToCart({ ...item })} style={{
                width: 32, height: 32, borderRadius: "50%", border: `1px solid ${COLORS.gold}`,
                fontSize: 16, color: COLORS.gold, background: "rgba(197,162,88,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>+</button>
              <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.charcoal, minWidth: 60, textAlign: "right", fontFamily: "'Josefin Sans', sans-serif" }}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 24px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.warmWhite }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif" }}>Subtotal</span>
          <span style={{ fontSize: 14, fontWeight: 500, fontFamily: "'Josefin Sans', sans-serif" }}>${cartTotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif" }}>Tax (6.625%)</span>
          <span style={{ fontSize: 14, fontWeight: 500, fontFamily: "'Josefin Sans', sans-serif" }}>${tax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 20, fontWeight: 500, color: COLORS.charcoal }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif" }}>${(cartTotal + tax).toFixed(2)}</span>
        </div>
        <button onClick={onCheckout} style={{
          width: "100%", padding: "18px", fontSize: 16, fontWeight: 600,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: COLORS.gold, color: "#fff", borderRadius: 4, transition: "all 0.2s ease",
        }}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

// ─── Checkout Screen ────────────────────────────────────────────────────────
function CheckoutScreen({ cartTotal, tax, tipPercent, setTipPercent, tipAmount, ccFee, grandTotal, customerName, setCustomerName, phoneNumber, setPhoneNumber, paymentMethod, setPaymentMethod, onBack, onPay }) {
  const tips = [0, 10, 15, 18, 20];
  const payMethods = [
    { id: "credit", label: "Credit Card", icon: "💳", note: "3.5% processing fee" },
    { id: "gift", label: "Gift Card", icon: "🎁", note: "No extra fees" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.warmWhite,
      }}>
        <button onClick={onBack} style={{ fontSize: 14, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500 }}>← Cart</button>
        <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ height: 72, objectFit: "contain" }}/>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 4 }}>Name for Order <span style={{ fontWeight: 300, fontSize: 11, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter your first name"
            style={{ width: "100%", padding: "14px 16px", fontSize: 17, border: `2px solid ${COLORS.border}`, borderRadius: 4, background: "#fff", color: COLORS.charcoal, outline: "none", transition: "border-color 0.2s ease" }}
            onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = COLORS.border} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 4 }}>Phone Number <span style={{ fontWeight: 300, fontSize: 11, textTransform: "none", letterSpacing: 0 }}>(optional — we'll text when your order is ready)</span></label>
          <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9+\-() ]/g, ""))} placeholder="(555) 123-4567" type="tel"
            style={{ width: "100%", padding: "14px 16px", fontSize: 17, border: `2px solid ${COLORS.border}`, borderRadius: 4, background: "#fff", color: COLORS.charcoal, outline: "none", transition: "border-color 0.2s ease" }}
            onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = COLORS.border} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 10 }}>Payment Method</label>
          <div style={{ display: "flex", gap: 12 }}>
            {payMethods.map(m => (
              <button key={m.id} onClick={() => setPaymentMethod(m.id)} style={{
                flex: 1, padding: "16px 12px", textAlign: "center", borderRadius: 4,
                border: `2px solid ${paymentMethod === m.id ? COLORS.gold : COLORS.border}`,
                background: paymentMethod === m.id ? "rgba(197,162,88,0.08)" : "#fff", transition: "all 0.2s ease",
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: paymentMethod === m.id ? COLORS.gold : COLORS.charcoal }}>{m.label}</div>
                <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>{m.note}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 10 }}>Add a Tip</label>
          <div style={{ display: "flex", gap: 10 }}>
            {tips.map(t => (
              <button key={t} onClick={() => setTipPercent(t)} style={{
                flex: 1, padding: "14px 8px", textAlign: "center", borderRadius: 4,
                border: `2px solid ${tipPercent === t ? COLORS.gold : COLORS.border}`,
                background: tipPercent === t ? "rgba(197,162,88,0.08)" : "#fff", transition: "all 0.2s ease",
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: tipPercent === t ? COLORS.gold : COLORS.charcoal }}>{t === 0 ? "None" : `${t}%`}</div>
                {t > 0 && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2, fontFamily: "'Josefin Sans', sans-serif" }}>${(cartTotal * t / 100).toFixed(2)}</div>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 4, border: `1px solid ${COLORS.border}`, padding: "20px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontSize: 14 }}>Subtotal</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontSize: 14 }}>Tax (6.625%)</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>${tax.toFixed(2)}</span>
          </div>
          {tipAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontSize: 14 }}>Tip ({tipPercent}%)</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>${tipAmount.toFixed(2)}</span>
          </div>}
          {ccFee > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#D32F2F", fontFamily: "'Josefin Sans', sans-serif", fontSize: 14 }}>Card Fee (3.5%)</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#D32F2F" }}>${ccFee.toFixed(2)}</span>
          </div>}
          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: COLORS.charcoal }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif" }}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.warmWhite }}>
        <button onClick={onPay} style={{
          width: "100%", padding: "18px", fontSize: 16, fontWeight: 600,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: COLORS.gold, color: "#fff", borderRadius: 4,
          transition: "all 0.2s ease",
        }}>Pay ${grandTotal.toFixed(2)}</button>
      </div>
    </div>
  );
}

// ─── Payment Screen ─────────────────────────────────────────────────────────
function PaymentScreen({ grandTotal, paymentMethod, onBack, onComplete }) {
  const [cardInserted, setCardInserted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [giftCode, setGiftCode] = useState("");

  const handleInsertCard = () => {
    setCardInserted(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(onComplete, 600); }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  const handleGiftPay = () => {
    if (!giftCode.trim()) return;
    handleInsertCard();
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      {!cardInserted ? (
        <>
          <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ width: 240, maxWidth: "70%", objectFit: "contain", marginBottom: 32 }}/>
          <div style={{ fontSize: 72, marginBottom: 24 }}>{paymentMethod === "gift" ? "🎁" : "💳"}</div>
          <h2 style={{ fontSize: 30, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8 }}>
            {paymentMethod === "gift" ? "Enter Gift Card" : "Insert or Tap Card"}
          </h2>
          <Flourish />
          <p style={{ fontSize: 22, fontWeight: 600, color: COLORS.gold, marginTop: 20, fontFamily: "'Josefin Sans', sans-serif" }}>${grandTotal.toFixed(2)}</p>

          {paymentMethod === "gift" ? (
            <div style={{ marginTop: 24, width: "100%", maxWidth: 360, textAlign: "center" }}>
              <input value={giftCode} onChange={e => setGiftCode(e.target.value)} placeholder="Enter gift card number"
                style={{ width: "100%", padding: "14px 16px", fontSize: 17, border: `2px solid ${COLORS.border}`, borderRadius: 4, background: "#fff", color: COLORS.charcoal, outline: "none", textAlign: "center", letterSpacing: "0.1em", transition: "border-color 0.2s ease" }}
                onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = COLORS.border} />
              <button onClick={handleGiftPay} disabled={!giftCode.trim()} style={{
                marginTop: 20, padding: "20px 48px", fontSize: 15, fontWeight: 600, width: "100%",
                fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
                background: giftCode.trim() ? COLORS.gold : COLORS.border, color: "#fff", borderRadius: 4,
                opacity: giftCode.trim() ? 1 : 0.6, transition: "all 0.2s ease",
              }}>Redeem Gift Card</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, color: COLORS.textLight, marginTop: 16, maxWidth: 300, textAlign: "center", fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6 }}>
                Insert, tap, or swipe your credit or debit card on the reader below
              </p>
              <button onClick={handleInsertCard} style={{
                marginTop: 40, padding: "20px 48px", fontSize: 15, fontWeight: 600,
                fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
                background: COLORS.gold, color: "#fff", borderRadius: 4, animation: "pulse 2s ease infinite",
              }}>Simulate Card Tap</button>
            </>
          )}
          <button onClick={onBack} style={{ marginTop: 20, fontSize: 13, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400, letterSpacing: "0.04em" }}>Cancel</button>
        </>
      ) : (
        <>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            border: `3px solid ${progress >= 100 ? COLORS.success : COLORS.gold}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, transition: "border-color 0.3s ease", marginBottom: 24,
          }}>{progress >= 100 ? "✓" : "⏳"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 300, color: COLORS.charcoal, marginBottom: 12 }}>
            {progress >= 100 ? "Payment Approved!" : "Processing Payment..."}
          </h2>
          <div style={{ width: 240, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden", marginTop: 8 }}>
            <div style={{
              width: `${progress}%`, height: "100%", borderRadius: 3,
              background: progress >= 100 ? COLORS.success : `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`,
              transition: "width 0.3s ease",
            }} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Confirmation Screen ────────────────────────────────────────────────────
function ConfirmationScreen({ orderNumber, customerName, phoneNumber, cart, cartTotal, tax, tipAmount, ccFee, grandTotal, paymentMethod, onNewOrder }) {
  const [smsSent, setSmsSent] = useState(false);

  // Silent print via hidden iframe with embedded logo
  const silentPrint = useCallback(() => {
    const receiptEl = document.getElementById("receipt-section");
    if (!receiptEl) return;

    // Clone receipt and convert logo to inline for print
    const clone = receiptEl.cloneNode(true);
    const imgs = clone.querySelectorAll("img");

    // Convert all images to base64 for reliable iframe printing
    const promises = Array.from(imgs).map(img => {
      return new Promise(resolve => {
        const canvas = document.createElement("canvas");
        const src = new Image();
        src.crossOrigin = "anonymous";
        src.onload = () => {
          canvas.width = src.naturalWidth;
          canvas.height = src.naturalHeight;
          canvas.getContext("2d").drawImage(src, 0, 0);
          try { img.src = canvas.toDataURL("image/png"); } catch(e) {}
          resolve();
        };
        src.onerror = () => resolve();
        src.src = img.src;
      });
    });

    Promise.all(promises).then(() => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;width:0;height:0;border:0;";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<html><head><style>
        body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; color: #000; }
        img { max-width: 180px; display: block; margin: 0 auto 8px; }
        div { color: #000 !important; }
        @page { margin: 5mm; }
      </style></head><body>${clone.innerHTML}</body></html>`);
      doc.close();
      // Wait for content to render then print
      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 2000);
      };
      // Fallback if onload doesn't fire
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch(e) {}
        setTimeout(() => { try { document.body.removeChild(iframe); } catch(e) {} }, 2000);
      }, 500);
    });
  }, []);

  // Auto-print receipt on default printer (silent)
  useEffect(() => {
    const timer = setTimeout(silentPrint, 800);
    return () => clearTimeout(timer);
  }, [silentPrint]);

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      padding: "40px 24px", overflowY: "auto",
      background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.warmWhite} 100%)`,
    }}>
      <div style={{ animation: "slideUp 0.5s ease both", textAlign: "center", width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 34, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8 }}>Merci{customerName ? `, ${customerName}` : ""}!</h1>
        <Flourish />
        <p style={{ fontSize: 15, color: COLORS.textLight, marginTop: 12, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>Your order has been placed successfully</p>

        <div style={{ marginTop: 28, padding: "24px", background: "#fff", borderRadius: 4, border: `2px solid ${COLORS.gold}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.textLight }}>Order Number</div>
          <div style={{ fontSize: 52, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", marginTop: 4 }}>#{orderNumber}</div>
        </div>

        <div id="receipt-section" style={{ marginTop: 24, background: "#fff", borderRadius: 4, border: `1px solid ${COLORS.border}`, padding: "20px", textAlign: "left" }}>
          <div style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 12, marginBottom: 12 }}>
            <div style={{ textAlign: "center" }}>
              <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ width: 200, maxWidth: "70%", objectFit: "contain", marginBottom: 10 }}/>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif" }}>14-16 Witherspoon St · Princeton, NJ</div>
            </div>
          </div>
          {cart.map(item => (
            <div key={item.cartKey} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, fontFamily: "'Josefin Sans', sans-serif" }}>
              <span style={{ color: COLORS.charcoal }}>{item.qty}× {item.name}{item.variant ? ` (${item.variant})` : ""}</span>
              <span style={{ fontWeight: 500, color: COLORS.charcoal }}>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 10, paddingTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", marginBottom: 4 }}>
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", marginBottom: 4 }}>
              <span>Tax</span><span>${tax.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", marginBottom: 4 }}>
              <span>Tip</span><span>${tipAmount.toFixed(2)}</span>
            </div>}
            {ccFee > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", marginBottom: 4 }}>
              <span>Card Fee (3.5%)</span><span>${ccFee.toFixed(2)}</span>
            </div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", marginBottom: 4 }}>
              <span>Paid via</span><span>{paymentMethod === "gift" ? "Gift Card" : "Credit Card"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>
              <span>Total Charged</span><span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 15, color: COLORS.charcoal, marginTop: 24, fontWeight: 400, lineHeight: 1.6 }}>
          {phoneNumber ? "We'll text you when your order is ready." : "We'll call your name when your order is ready. Please wait near the pickup counter."}
        </p>

        <button onClick={silentPrint} style={{
          marginTop: 20, padding: "14px 40px", fontSize: 14, fontWeight: 500,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: COLORS.gold, color: "#fff", border: `2px solid ${COLORS.gold}`, borderRadius: 4,
        }}>🖨️ Print Receipt</button>

        {phoneNumber && (
          <button onClick={() => { setSmsSent(true); setTimeout(() => setSmsSent(false), 3000); }} disabled={smsSent} style={{
            marginTop: 12, padding: "14px 40px", fontSize: 14, fontWeight: 500,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
            background: smsSent ? COLORS.success : "#1976D2", color: "#fff",
            border: `2px solid ${smsSent ? COLORS.success : "#1976D2"}`, borderRadius: 4,
            transition: "all 0.2s ease",
          }}>{smsSent ? "✓ Receipt Sent!" : `📱 SMS Receipt to ${phoneNumber}`}</button>
        )}

        <button onClick={onNewOrder} style={{
          marginTop: 12, padding: "16px 48px", fontSize: 14, fontWeight: 500,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: "transparent", color: COLORS.gold, border: `2px solid ${COLORS.gold}`, borderRadius: 4,
        }}>Start New Order</button>

        <p style={{ marginTop: 20, fontSize: 11, color: COLORS.textLight, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
          Screen will reset automatically in 30 seconds
        </p>
      </div>
    </div>
  );
}
