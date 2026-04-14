import { useState, useEffect, useRef, useCallback } from "react";

// ─── Menu Data ──────────────────────────────────────────────────────────────
const MENU = {
  croissants: {
    label: "Croissants",
    icon: "🥐",
    items: [
      { id: "c1", name: "Plain Croissant", price: 4.00, desc: "Classic buttery French croissant" },
      { id: "c2", name: "Almond Croissant", price: 6.00, desc: "Filled with almond cream & topped with sliced almonds", tags: ["TN"] },
      { id: "c3", name: "Pain Au Chocolat", price: 5.50, desc: "Rich dark chocolate batons in laminated dough" },
      { id: "c4", name: "Berry Croissant", price: 7.00, desc: "Light French vanilla cream with seasonal berries" },
      { id: "c5", name: "Pistachio Croissant", price: 6.50, desc: "Pistachio cream filled, topped with crushed pistachios", tags: ["TN"] },
      { id: "c6", name: "Chocolate Almond", price: 6.00, desc: "Dark chocolate & almond cream croissant", tags: ["TN"] },
      { id: "c7", name: "Ham & Gruyère", price: 5.50, desc: "Savory croissant with ham & melted Gruyère cheese" },
      { id: "c8", name: "Chocolate Pistachio", price: 7.00, desc: "Chocolate & pistachio cream filled croissant", tags: ["TN"] },
      { id: "c9", name: "Cardamom Croissant", price: 5.00, desc: "Aromatic cardamom-spiced laminated pastry" },
      { id: "c10", name: "Cheddar & Chives", price: 4.50, desc: "Savory cheddar cheese & fresh chives" },
      { id: "c11", name: "Cherry Cheese", price: 6.00, desc: "Cherry compote with cream cheese filling" },
      { id: "c12", name: "Pecan Pie Croissant", price: 6.00, desc: "Caramelized pecan filling in flaky pastry", tags: ["TN"] },
      { id: "c13", name: "Smoked Salmon", price: 5.50, desc: "Smoked salmon with crème fraîche" },
      { id: "c14", name: "Palmier", price: 4.50, desc: "Caramelized puff pastry elephant ear" },
      { id: "c15", name: "Blueberry Scone", price: 4.00, desc: "Fresh blueberry buttermilk scone" },
    ]
  },
  breakfast: {
    label: "Breakfast",
    icon: "🍳",
    items: [
      { id: "b1", name: "Breakfast Sandwich", price: 9.00, desc: "Two eggs & American cheese on your choice of bread", addons: [
        { id: "ba1", name: "Add Bacon", price: 2.00 },
        { id: "ba2", name: "Add Sausage", price: 2.00 },
        { id: "ba3", name: "Add Ham", price: 2.00 },
        { id: "ba4", name: "Add Pork Roll", price: 2.00 },
        { id: "ba5", name: "Sub Bagel", price: 2.00 },
        { id: "ba6", name: "Sub Croissant", price: 2.00 },
      ]},
      { id: "b2", name: "Everything Bagel", price: 2.50, desc: "Enriched wheat with everything seasoning", tags: ["G","D","S"] },
      { id: "b3", name: "Plain Bagel", price: 3.00, desc: "Classic enriched wheat bagel", tags: ["G","D","S"] },
      { id: "b4", name: "Jerusalem Bagel", price: 3.00, desc: "Traditional Jerusalem-style oval bagel" },
    ]
  },
  beveragesHot: {
    label: "Hot Drinks",
    icon: "☕",
    items: [
      { id: "bh1", name: "Coffee", desc: "Freshly brewed", sizes: [{ label: "Small", price: 3.00 }, { label: "Large", price: 4.00 }] },
      { id: "bh2", name: "Espresso", desc: "Rich double shot", sizes: [{ label: "Small", price: 4.00 }, { label: "Large", price: 5.00 }] },
      { id: "bh3", name: "Americano", desc: "Espresso with hot water", sizes: [{ label: "Small", price: 4.50 }, { label: "Large", price: 5.50 }] },
      { id: "bh4", name: "Café au Lait", desc: "Coffee with steamed milk", sizes: [{ label: "Small", price: 3.50 }, { label: "Large", price: 4.50 }] },
      { id: "bh5", name: "Cappuccino", desc: "Espresso, steamed milk & foam", sizes: [{ label: "Small", price: 5.50 }, { label: "Large", price: 6.50 }] },
      { id: "bh6", name: "Latte", desc: "Espresso with silky steamed milk", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }] },
      { id: "bh7", name: "Mocha", desc: "Espresso, chocolate & steamed milk", sizes: [{ label: "Small", price: 6.50 }, { label: "Large", price: 7.50 }] },
      { id: "bh8", name: "Chai Latte", desc: "Spiced chai with steamed milk", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }] },
      { id: "bh9", name: "French Hot Chocolate", desc: "Rich European-style sipping chocolate", sizes: [{ label: "Small", price: 6.00 }, { label: "Large", price: 7.00 }] },
      { id: "bh10", name: "Macchiato", desc: "Espresso marked with foam", sizes: [{ label: "Small", price: 4.50 }, { label: "Large", price: 5.50 }] },
      { id: "bh11", name: "White Mocha", desc: "Espresso with white chocolate & milk", sizes: [{ label: "Small", price: 6.50 }, { label: "Large", price: 7.50 }] },
      { id: "bh12", name: "Tea", desc: "Selection of fine teas", sizes: [{ label: "Small", price: 3.75 }, { label: "Large", price: 4.50 }] },
    ]
  },
  beveragesCold: {
    label: "Cold Drinks",
    icon: "🧊",
    items: [
      { id: "bc1", name: "Iced Coffee", price: 3.75, desc: "Cold brewed & refreshing" },
      { id: "bc2", name: "Iced Latte", price: 4.50, desc: "Espresso over ice with cold milk" },
      { id: "bc3", name: "Iced Americano", price: 4.25, desc: "Espresso with cold water over ice" },
      { id: "bc4", name: "Iced Cappuccino", price: 5.25, desc: "Iced espresso with cold foam" },
      { id: "bc5", name: "Iced Mocha", price: 5.25, desc: "Chocolate espresso over ice" },
      { id: "bc6", name: "Iced Chai Latte", price: 5.25, desc: "Spiced chai over ice" },
      { id: "bc7", name: "French Iced Chocolate", price: 5.25, desc: "Chilled French chocolate drink" },
      { id: "bc8", name: "Lemonade", price: 5.25, desc: "Freshly squeezed lemonade" },
      { id: "bc9", name: "Hibiscus Iced Tea", price: 5.25, desc: "Vibrant hibiscus flower tea" },
      { id: "bc10", name: "Butterfly Blue Rose Iced Tea", price: 5.25, desc: "Color-changing blue rose tea" },
      { id: "bc11", name: "Apple Mint Lavender Iced Tea", price: 5.25, desc: "Apple, mint & lavender infusion" },
      { id: "bc12", name: "Juices", price: 4.00, desc: "Ask about today's selection" },
      { id: "bc13", name: "Soda", price: 3.50, desc: "Assorted sodas" },
      { id: "bc14", name: "Water", price: 4.00, desc: "Still or sparkling" },
    ]
  },
  macarons: {
    label: "Macarons",
    icon: "🌈",
    items: [
      { id: "m1", name: "Birthday Cake", desc: "Almond shell with funfetti, vanilla buttercream", tags: ["GF"], macaron: true },
      { id: "m2", name: "Chocolate", desc: "Chocolate shell with nibs, dark ganache", tags: ["GF"], macaron: true },
      { id: "m3", name: "Pistachio", desc: "Dipped in dark chocolate, pistachio cream", tags: ["GF"], macaron: true },
      { id: "m4", name: "Salted Caramel", desc: "Nougat dusted, caramel ganache & sea salt", tags: ["GF"], macaron: true },
      { id: "m5", name: "Raspberry", desc: "Raspberry cream, raspberry jam filling", tags: ["GF"], macaron: true },
      { id: "m6", name: "Lavender", desc: "Lavender blossoms, lavender buttercream", tags: ["GF"], macaron: true },
      { id: "m7", name: "Lemon", desc: "Bright lemon cream filling", tags: ["GF"], macaron: true },
      { id: "m8", name: "Tiramisu", desc: "Coffee shell, cocoa dusted, mascarpone", tags: ["GF"], macaron: true },
      { id: "m9", name: "Strawberry", desc: "Strawberry crisps, strawberry buttercream", tags: ["GF"], macaron: true },
      { id: "m10", name: "Dulce de Leche", desc: "Almond shell, dulce de leche filling", tags: ["GF"], macaron: true },
      { id: "m11", name: "Hazelnut", desc: "Almond shell, hazelnut ganache", tags: ["GF","TN"], macaron: true },
      { id: "m12", name: "Chocolate Blood Orange", desc: "Chocolate & orange ganache", tags: ["GF"], macaron: true },
    ]
  },
  patisserie: {
    label: "Pâtisserie",
    icon: "🎂",
    items: [
      { id: "p1", name: "Chocolate Éclair", price: 8.00, desc: "Chocolate pastry cream, dark chocolate glaze" },
      { id: "p2", name: "Rose Éclair", price: 8.00, desc: "Rose pastry cream, white glaze, dried rose petals" },
      { id: "p3", name: "Raspberry Napoleon", price: 8.00, desc: "Caramelized puff pastry, raspberry cream" },
      { id: "p4", name: "Vanilla Napoleon", price: 8.00, desc: "Caramelized puff pastry, vanilla cream" },
      { id: "p5", name: "Parisian Flan", price: 9.00, desc: "Classic French baked vanilla custard" },
      { id: "p6", name: "Tiramisu", price: 9.00, desc: "Mascarpone, ladyfingers, coffee & dark rum" },
      { id: "p7", name: "Cassis", price: 9.00, desc: "Black currant mousse cake", tags: ["TN"] },
      { id: "p8", name: "Opera", price: 9.00, desc: "Coffee, almond & dark chocolate layers", tags: ["TN"] },
      { id: "p9", name: "Lemon Blueberry", price: 11.00, desc: "Lemon cake, blueberry compote, lemon mousse" },
      { id: "p10", name: "Chocolate Pear", price: 11.00, desc: "Chocolate & poached pear mousse", tags: ["TN"] },
      { id: "p11", name: "Black Forest Cherry", price: 11.00, desc: "Chocolate cake, dark mousse, sour cherries" },
      { id: "p12", name: "Dobosh Torte", price: 12.00, desc: "Rum joconde, caramel & chocolate ganache", tags: ["TN"] },
      { id: "p13", name: "Dark Chocolate Flourless", price: 8.00, desc: "Rich flourless chocolate cake", tags: ["GF"] },
      { id: "p14", name: "Ricotta Cheesecake", price: 8.00, desc: "Ricotta cheesecake on sweet cookie base" },
      { id: "p15", name: "Key Lime", price: 9.00, desc: "Graham crust, key lime custard, mascarpone" },
      { id: "p16", name: "Carrot Cake", price: 9.00, desc: "Carrots, pecans, cream cheese frosting", tags: ["TN"] },
    ]
  },
  tarts: {
    label: "Tarts",
    icon: "🥧",
    items: [
      { id: "t1", name: "Fresh Fruit Tartlet", price: 9.00, desc: "Seasonal fruit & pastry cream" },
      { id: "t2", name: "Lemon Tartlet", price: 9.00, desc: "Lemon curd & toasted meringue" },
      { id: "t3", name: "Apple Tartlet", price: 9.00, desc: "Baked apples & apple custard" },
      { id: "t4", name: "Almondine Tartlet", price: 9.00, desc: "Apricot jam & frangipane", tags: ["TN"] },
      { id: "t5", name: "Pear Tartlet", price: 9.00, desc: "Poached pears & frangipane" },
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
  const [animating, setAnimating] = useState(false);
  const [tipPercent, setTipPercent] = useState(0);
  const timeoutRef = useRef(null);

  const navigateTo = useCallback((s) => {
    setAnimating(true);
    setTimeout(() => { setScreen(s); setAnimating(false); }, 250);
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tipAmount = cartTotal * tipPercent / 100;
  const tax = cartTotal * 0.06625;
  const grandTotal = cartTotal + tipAmount + tax;
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

  // Auto-return to welcome after confirmation
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
      `}</style>

      <div style={styles.fadeWrap}>
        {screen === SCREENS.WELCOME && <WelcomeScreen onStart={() => navigateTo(SCREENS.MENU)} />}
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
            tipAmount={tipAmount} grandTotal={grandTotal}
            customerName={customerName} setCustomerName={setCustomerName}
            onBack={() => navigateTo(SCREENS.CART)}
            onPay={() => navigateTo(SCREENS.PAYMENT)}
          />
        )}
        {screen === SCREENS.PAYMENT && (
          <PaymentScreen
            grandTotal={grandTotal}
            onBack={() => navigateTo(SCREENS.CHECKOUT)}
            onComplete={() => { setOrderNumber(Math.floor(100 + Math.random() * 900)); navigateTo(SCREENS.CONFIRM); }}
          />
        )}
        {screen === SCREENS.CONFIRM && (
          <ConfirmationScreen
            orderNumber={orderNumber} customerName={customerName}
            cart={cart} cartTotal={cartTotal} tax={tax} tipAmount={tipAmount} grandTotal={grandTotal}
            onNewOrder={startNewOrder}
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
      <h1 style={{
        fontSize: 42, fontWeight: 300, color: COLORS.charcoal, marginTop: 24,
        letterSpacing: "0.04em", lineHeight: 1.2,
      }}>
        Bienvenue
      </h1>
      <p style={{
        fontSize: 17, color: COLORS.textLight, marginTop: 12, maxWidth: 380,
        fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6, letterSpacing: "0.02em",
      }}>
        Artisanal French pastries, coffee & cuisine<br/>in the heart of Princeton
      </p>
      <button onClick={onStart} style={{
        marginTop: 48, padding: "18px 64px", fontSize: 18, fontWeight: 500,
        fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase",
        background: COLORS.gold, color: "#fff", borderRadius: 0, border: `2px solid ${COLORS.gold}`,
        transition: "all 0.3s ease", position: "relative", overflow: "hidden",
      }}
        onMouseEnter={e => { e.target.style.background = "transparent"; e.target.style.color = COLORS.gold; }}
        onMouseLeave={e => { e.target.style.background = COLORS.gold; e.target.style.color = "#fff"; }}
      >
        Touch to Order
      </button>
      <p style={{
        marginTop: 60, fontSize: 12, color: COLORS.textLight,
        fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
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
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <HeaderBar cartCount={cartCount} cartTotal={cartTotal} onOpenCart={onOpenCart} />
      <CategoryNav selected={category} onSelect={setCategory} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8, paddingLeft: 8 }}>
          {MENU[category]?.label}
        </h2>
        <div style={{ paddingLeft: 8, marginBottom: 20 }}><Flourish /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {items.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} onSelect={() => onSelectItem(item)} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuCard({ item, index, onSelect, addToCart }) {
  const [hovered, setHovered] = useState(false);
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
      {/* Decorative top bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})` }} />
      <div style={{ padding: "20px 18px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 19, fontWeight: 500, color: COLORS.charcoal, lineHeight: 1.25, marginBottom: 6 }}>
              {item.name}
            </h3>
            {item.tags && (
              <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                {item.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 2,
                    background: t === "GF" ? "#E8F5E8" : t === "V" ? "#E8F0E8" : COLORS.rosePale,
                    color: t === "GF" ? COLORS.success : COLORS.rose,
                    fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.05em",
                  }}>{t}</span>
                ))}
              </div>
            )}
            <p style={{
              fontSize: 13, color: COLORS.textLight, lineHeight: 1.5,
              fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300,
            }}>{item.desc}</p>
          </div>
          <span style={{
            fontSize: 15, fontWeight: 600, color: COLORS.gold, whiteSpace: "nowrap",
            fontFamily: "'Josefin Sans', sans-serif",
          }}>{priceLabel}</span>
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          {!item.sizes && !item.macaron && !item.addons && (
            <button onClick={(e) => { e.stopPropagation(); addToCart({ ...item, cartKey: item.id }); }} style={{
              flex: 1, padding: "10px", fontSize: 13, fontWeight: 500,
              fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
              background: COLORS.gold, color: "#fff", borderRadius: 2,
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => e.target.style.background = COLORS.goldDark}
              onMouseLeave={e => e.target.style.background = COLORS.gold}
            >
              Quick Add
            </button>
          )}
          <button onClick={onSelect} style={{
            flex: 1, padding: "10px", fontSize: 13, fontWeight: 500,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
            background: "transparent", color: COLORS.gold, borderRadius: 2,
            border: `1px solid ${COLORS.gold}`, transition: "all 0.2s ease",
          }}>
            {item.sizes || item.macaron || item.addons ? "Customize" : "Details"}
          </button>
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
        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.rosePale} 0%, ${COLORS.cream} 100%)`,
          padding: "40px 24px", textAlign: "center",
        }}>
          <button onClick={onBack} style={{
            position: "absolute", left: 20, top: 80, fontSize: 14, color: COLORS.gold,
            fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500, letterSpacing: "0.06em",
          }}>← Back</button>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{MENU[Object.keys(MENU).find(k => MENU[k].items.find(i => i.id === item.id))]?.icon}</div>
          <h1 style={{ fontSize: 36, fontWeight: 400, color: COLORS.charcoal, marginBottom: 8 }}>{item.name}</h1>
          <Flourish />
          <p style={{
            fontSize: 15, color: COLORS.textLight, marginTop: 12, maxWidth: 400, margin: "12px auto 0",
            fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6,
          }}>{item.desc}</p>
          {item.tags && (
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
              {item.tags.map(t => (
                <span key={t} style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 2,
                  background: t === "GF" ? "#E8F5E8" : COLORS.rosePale,
                  color: t === "GF" ? COLORS.success : COLORS.rose,
                  fontFamily: "'Josefin Sans', sans-serif", fontWeight: 500,
                }}>{t === "GF" ? "Gluten-Free" : t === "TN" ? "Tree Nut" : t === "V" ? "Vegan" : t}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "24px 24px" }}>
          {/* Size Selection */}
          {item.sizes && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>Select Size</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {item.sizes.map((s, i) => (
                  <button key={i} onClick={() => setSelectedSize(i)} style={{
                    flex: 1, padding: "16px", textAlign: "center", borderRadius: 4,
                    border: `2px solid ${selectedSize === i ? COLORS.gold : COLORS.border}`,
                    background: selectedSize === i ? "rgba(197,162,88,0.06)" : "#fff",
                    transition: "all 0.2s ease",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: COLORS.charcoal }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>${s.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Macaron Qty */}
          {item.macaron && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>Select Quantity</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {Object.entries(MACARON_PRICES).map(([label, price]) => (
                  <button key={label} onClick={() => setMacaronQty(label)} style={{
                    flex: 1, padding: "16px 8px", textAlign: "center", borderRadius: 4,
                    border: `2px solid ${macaronQty === label ? COLORS.gold : COLORS.border}`,
                    background: macaronQty === label ? "rgba(197,162,88,0.06)" : "#fff",
                    transition: "all 0.2s ease",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: COLORS.charcoal }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.gold, marginTop: 4, fontFamily: "'Josefin Sans', sans-serif" }}>${price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          {item.addons && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 12 }}>Customize</h3>
              {item.addons.map(a => {
                const sel = selectedAddons.find(sa => sa.id === a.id);
                return (
                  <button key={a.id} onClick={() => toggleAddon(a)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "14px 16px", marginBottom: 8, borderRadius: 4,
                    border: `2px solid ${sel ? COLORS.gold : COLORS.border}`,
                    background: sel ? "rgba(197,162,88,0.06)" : "#fff",
                    transition: "all 0.2s ease", textAlign: "left",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 4,
                        border: `2px solid ${sel ? COLORS.gold : COLORS.border}`,
                        background: sel ? COLORS.gold : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 14, transition: "all 0.2s ease",
                      }}>{sel ? "✓" : ""}</div>
                      <span style={{ fontSize: 15, color: COLORS.charcoal }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif" }}>+${a.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quantity */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 28 }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
              width: 44, height: 44, borderRadius: "50%", border: `2px solid ${COLORS.border}`,
              fontSize: 20, color: COLORS.charcoal, display: "flex", alignItems: "center", justifyContent: "center",
              background: "#fff",
            }}>−</button>
            <span style={{ fontSize: 28, fontWeight: 500, color: COLORS.charcoal, minWidth: 40, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{
              width: 44, height: 44, borderRadius: "50%", border: `2px solid ${COLORS.gold}`,
              fontSize: 20, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(197,162,88,0.06)",
            }}>+</button>
          </div>

          {/* Add Button */}
          <button onClick={handleAdd} style={{
            width: "100%", padding: "18px", fontSize: 16, fontWeight: 600,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
            background: added ? COLORS.success : COLORS.gold, color: "#fff", borderRadius: 4,
            transition: "all 0.3s ease",
          }}>
            {added ? "✓ Added to Order!" : `Add to Order · $${(getPrice() * qty).toFixed(2)}`}
          </button>
        </div>
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
        <p style={{ fontSize: 15, color: COLORS.textLight, marginTop: 12, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
          Browse our menu to start your order
        </p>
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

      {/* Totals & Checkout */}
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
        }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

// ─── Checkout Screen ────────────────────────────────────────────────────────
function CheckoutScreen({ cartTotal, tax, tipPercent, setTipPercent, tipAmount, grandTotal, customerName, setCustomerName, onBack, onPay }) {
  const tips = [0, 10, 15, 18, 20];

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
        {/* Name */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 10 }}>
            Name for Order
          </label>
          <input
            value={customerName} onChange={e => setCustomerName(e.target.value)}
            placeholder="Enter your first name"
            style={{
              width: "100%", padding: "14px 16px", fontSize: 17, border: `2px solid ${COLORS.border}`,
              borderRadius: 4, background: "#fff", color: COLORS.charcoal, outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={e => e.target.style.borderColor = COLORS.gold}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </div>

        {/* Tip */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.textLight, marginBottom: 10 }}>
            Add a Tip
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {tips.map(t => (
              <button key={t} onClick={() => setTipPercent(t)} style={{
                flex: 1, padding: "14px 8px", textAlign: "center", borderRadius: 4,
                border: `2px solid ${tipPercent === t ? COLORS.gold : COLORS.border}`,
                background: tipPercent === t ? "rgba(197,162,88,0.08)" : "#fff",
                transition: "all 0.2s ease",
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: tipPercent === t ? COLORS.gold : COLORS.charcoal }}>
                  {t === 0 ? "None" : `${t}%`}
                </div>
                {t > 0 && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2, fontFamily: "'Josefin Sans', sans-serif" }}>
                  ${(cartTotal * t / 100).toFixed(2)}
                </div>}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
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
          <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: COLORS.charcoal }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif" }}>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 24px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.warmWhite }}>
        <button onClick={onPay} disabled={!customerName.trim()} style={{
          width: "100%", padding: "18px", fontSize: 16, fontWeight: 600,
          fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
          background: customerName.trim() ? COLORS.gold : COLORS.border, color: "#fff", borderRadius: 4,
          transition: "all 0.2s ease", opacity: customerName.trim() ? 1 : 0.6,
        }}>
          Pay ${grandTotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

// ─── Payment Screen ─────────────────────────────────────────────────────────
function PaymentScreen({ grandTotal, onBack, onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [cardInserted, setCardInserted] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleInsertCard = () => {
    setCardInserted(true);
    setProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(onComplete, 600); }
      setProgress(Math.min(p, 100));
    }, 400);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      {!cardInserted ? (
        <>
          <img src="https://www.genesisglobalgrp.com/mods/images/logo_chez_alice.png" alt="Chez Alice" style={{ width: 240, maxWidth: "70%", objectFit: "contain", marginBottom: 32 }}/>
          <div style={{ fontSize: 72, marginBottom: 24 }}>💳</div>
          <h2 style={{ fontSize: 30, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8 }}>Insert or Tap Card</h2>
          <Flourish />
          <p style={{
            fontSize: 22, fontWeight: 600, color: COLORS.gold, marginTop: 20,
            fontFamily: "'Josefin Sans', sans-serif",
          }}>${grandTotal.toFixed(2)}</p>
          <p style={{
            fontSize: 14, color: COLORS.textLight, marginTop: 16, maxWidth: 300, textAlign: "center",
            fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, lineHeight: 1.6,
          }}>
            Insert, tap, or swipe your credit or debit card on the reader below
          </p>

          {/* Simulated card reader */}
          <button onClick={handleInsertCard} style={{
            marginTop: 40, padding: "20px 48px", fontSize: 15, fontWeight: 600,
            fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase",
            background: COLORS.gold, color: "#fff", borderRadius: 4, animation: "pulse 2s ease infinite",
          }}>
            Simulate Card Tap
          </button>

          <button onClick={onBack} style={{
            marginTop: 20, fontSize: 13, color: COLORS.textLight,
            fontFamily: "'Josefin Sans', sans-serif", fontWeight: 400, letterSpacing: "0.04em",
          }}>Cancel</button>
        </>
      ) : (
        <>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            border: `3px solid ${progress >= 100 ? COLORS.success : COLORS.gold}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, transition: "border-color 0.3s ease", marginBottom: 24,
          }}>
            {progress >= 100 ? "✓" : "⏳"}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 300, color: COLORS.charcoal, marginBottom: 12 }}>
            {progress >= 100 ? "Payment Approved!" : "Processing Payment..."}
          </h2>
          <div style={{
            width: 240, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden", marginTop: 8,
          }}>
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
function ConfirmationScreen({ orderNumber, customerName, cart, cartTotal, tax, tipAmount, grandTotal, onNewOrder }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      padding: "40px 24px", overflowY: "auto",
      background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.warmWhite} 100%)`,
    }}>
      <div style={{ animation: "slideUp 0.5s ease both", textAlign: "center", width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 34, fontWeight: 300, color: COLORS.charcoal, marginBottom: 8 }}>Merci, {customerName}!</h1>
        <Flourish />
        <p style={{ fontSize: 15, color: COLORS.textLight, marginTop: 12, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}>
          Your order has been placed successfully
        </p>

        {/* Order Number */}
        <div style={{
          marginTop: 28, padding: "24px", background: "#fff", borderRadius: 4,
          border: `2px solid ${COLORS.gold}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.textLight }}>Order Number</div>
          <div style={{ fontSize: 52, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", marginTop: 4 }}>#{orderNumber}</div>
        </div>

        {/* Receipt */}
        <div style={{ marginTop: 24, background: "#fff", borderRadius: 4, border: `1px solid ${COLORS.border}`, padding: "20px", textAlign: "left" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: COLORS.gold, fontFamily: "'Josefin Sans', sans-serif", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.border}` }}>
              <span>Total Charged</span><span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 15, color: COLORS.charcoal, marginTop: 24, fontWeight: 400, lineHeight: 1.6 }}>
          We'll call your name when your order is ready. Please wait near the pickup counter.
        </p>

        <button onClick={onNewOrder} style={{
          marginTop: 28, padding: "16px 48px", fontSize: 14, fontWeight: 500,
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
