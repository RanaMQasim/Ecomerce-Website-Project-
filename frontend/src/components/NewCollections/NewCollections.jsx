import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";
import { getProducts } from "../../services/products";

const normalizeCategory = (item) => {
  const cat =
    (item.category && String(item.category)) ||
    (item.gender && String(item.gender)) ||
    (item.tags && (Array.isArray(item.tags) ? item.tags.join(" ") : String(item.tags))) ||
    "";
  return cat.toLowerCase();
};

const matchesCategory = (item, target) => {
  const cat = normalizeCategory(item);
  if (!cat) return false;
  if (target === "kids") {
    return /kid|kids|child|children|baby|toddler/i.test(cat);
  }
  if (target === "men") {
    return /\bmen\b|\bman\b|\bmale\b/i.test(cat);
  }
  if (target === "women") {
    return /\bwomen\b|\bwoman\b|\bfemale\b/i.test(cat);
  }
  return false;
};

const NewCollections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getProducts({ limit: 100, sort: "-createdAt" })
      .then((data) => {
        if (!mounted) return;
        const list = data?.products ?? data ?? [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        if (!mounted) return;
        setError("Failed to load products");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const PER_SECTION = 3; 
  const menProducts = products.filter((p) => matchesCategory(p, "men")).slice(0, PER_SECTION);
  const womenProducts = products.filter((p) => matchesCategory(p, "women")).slice(0, PER_SECTION);
  const kidsProducts = products.filter((p) => matchesCategory(p, "kids")).slice(0, PER_SECTION);
  const fillSection = (sectionArray, allProducts, alreadyUsedIds = []) => {
    if (sectionArray.length >= PER_SECTION) return sectionArray;
    const needed = PER_SECTION - sectionArray.length;
    const extras = allProducts.filter((p) => {
      const id = p._id ?? p.id;
      return !alreadyUsedIds.includes(id);
    });
    return sectionArray.concat(extras.slice(0, needed));
  };

  const usedIds = new Set();
  menProducts.forEach((p) => usedIds.add(p._id ?? p.id));
  let womenFinal = womenProducts.filter((p) => !usedIds.has(p._id ?? p.id));
  womenFinal.forEach((p) => usedIds.add(p._id ?? p.id));
  let kidsFinal = kidsProducts.filter((p) => !usedIds.has(p._id ?? p.id));
  kidsFinal.forEach((p) => usedIds.add(p._id ?? p.id));
  const remaining = products.filter((p) => !usedIds.has(p._id ?? p.id));
  const menFinal = fillSection(menProducts, remaining, Array.from(usedIds));
  menFinal.forEach((p) => usedIds.add(p._id ?? p.id));
  womenFinal = fillSection(womenFinal, products, Array.from(usedIds));
  womenFinal.forEach((p) => usedIds.add(p._id ?? p.id));
  kidsFinal = fillSection(kidsFinal, products, Array.from(usedIds));
  kidsFinal.forEach((p) => usedIds.add(p._id ?? p.id));

  return (
    <section className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      {loading && <div className="collections-loading">Loading collections…</div>}
      {error && <div className="collections-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="collections-category">
            <h2>Men</h2>
            <div className="collections-grid">
              {menFinal.length ? (
                menFinal.map((item) => {
                  const normalized = { ...item, id: item.id ?? item._id };
                  return <Item item={normalized} key={normalized.id} />;
                })
              ) : (
                <div className="collections-empty">No men collections found.</div>
              )}
            </div>
          </div>

          <div className="collections-category">
            <h2>Women</h2>
            <div className="collections-grid">
              {womenFinal.length ? (
                womenFinal.map((item) => {
                  const normalized = { ...item, id: item.id ?? item._id };
                  return <Item item={normalized} key={normalized.id} />;
                })
              ) : (
                <div className="collections-empty">No women collections found.</div>
              )}
            </div>
          </div>

          <div className="collections-category">
            <h2>Kids</h2>
            <div className="collections-grid">
              {kidsFinal.length ? (
                kidsFinal.map((item) => {
                  const normalized = { ...item, id: item.id ?? item._id };
                  return <Item item={normalized} key={normalized.id} />;
                })
              ) : (
                <div className="collections-empty">No kids collections found.</div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
export default NewCollections;