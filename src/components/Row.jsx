import React, { useEffect, useRef, useState } from 'react';
import Card from './Card';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from './Icons';

function useCardsPerPage() {
  const calc = () => {
    const w = window.innerWidth;
    if (w >= 1400) return 6;
    if (w >= 1100) return 5;
    if (w >= 800) return 4;
    if (w >= 500) return 3;
    return 2;
  };
  const [n, setN] = useState(calc);
  useEffect(() => {
    const onResize = () => setN(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return n;
}

/**
 * Horizontal slider. The track is translated page by page (not scrolled) so that
 * hover previews can overflow the row vertically without being clipped.
 */
export default function Row({
  title,
  items,
  top10 = false,
  progressMap = {},
  explore,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  defaultCollapsed = false,
  variant,
}) {
  const perPage = useCardsPerPage();
  const [page, setPage] = useState(0);
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;
  const rowVariant = variant || (top10 ? 'top10' : undefined);

  const trackRef = useRef(null);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const canSlide = items.length > perPage;

  useEffect(() => {
    if (page > pages - 1) setPage(0);
  }, [pages, page]);

  if (!items.length) return null;

  const go = (dir) => setPage((p) => (p + dir + pages) % pages);
  const toggleExpanded = () => setExpanded((isExpanded) => !isExpanded);
  const toggleCollapse = () => {
    if (isControlled) {
      onToggleCollapse?.(!collapsed);
    } else {
      setInternalCollapsed((c) => !c);
    }
  };

  // Translate by whole pages; the last page is clamped so it ends flush.
  const offset = Math.min(page * perPage, Math.max(0, items.length - perPage));
  const style = { transform: `translateX(calc(${-offset} * (100% / ${perPage})))` };

  return (
    <section
      className={`row ${top10 ? 'row--top10' : ''} ${rowVariant ? `row--${rowVariant}` : ''} ${collapsed ? 'row--collapsed' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="row__header">
        <div className="row__heading">
          <h2 className="row__title">{title}</h2>
          <button
            className="row__toggle-collapse"
            type="button"
            onClick={toggleCollapse}
            aria-expanded={!collapsed}
            aria-label={collapsed ? `Show cards for ${title}` : `Collapse cards for ${title}`}
            title={collapsed ? `Display cards for ${title}` : `Collapse cards for ${title}`}
          >
            <ChevronDownIcon
              width={14}
              height={14}
              className={`row__toggle-chevron ${collapsed ? 'is-collapsed' : ''}`}
            />
            <span className="row__toggle-text">
              {collapsed ? `Show Cards (${items.length})` : 'Collapse'}
            </span>
          </button>
          {!collapsed && explore && (
            <button
              className="row__explore"
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? 'Show Less' : 'Explore All'} <span aria-hidden="true">{expanded ? '‹' : '›'}</span>
            </button>
          )}
        </div>
        {!collapsed && !expanded && canSlide && (
          <div className="row__pagination">
            {Array.from({ length: pages }, (_, i) => (
              <span key={i} className={i === page ? 'is-active' : ''} />
            ))}
          </div>
        )}
      </div>

      <div className={`row__body ${collapsed ? 'is-collapsed' : ''}`} aria-hidden={collapsed}>
        {!expanded && (
          <div className="row__viewport">
            {canSlide && (
              <button className="row__handle row__handle--prev" type="button" aria-label="Previous" onClick={() => go(-1)}>
                <ChevronLeftIcon width={36} height={36} />
              </button>
            )}
            <div className="row__track" ref={trackRef} style={{ ...style, '--per-page': perPage }}>
              {items.map((item, i) => {
                const posInPage = (i - offset + perPage) % perPage;
                const visible = i >= offset && i < offset + perPage;
                const edge = visible ? (posInPage === 0 ? 'first' : posInPage === perPage - 1 ? 'last' : null) : null;
                return (
                  <div className="row__slot" key={item.id}>
                    <Card
                      item={item}
                      rank={top10 ? i + 1 : undefined}
                      progress={progressMap[item.id]}
                      edge={edge}
                      variant={rowVariant}
                    />
                  </div>
                );
              })}
            </div>
            {canSlide && (
              <button className="row__handle row__handle--next" type="button" aria-label="Next" onClick={() => go(1)}>
                <ChevronRightIcon width={36} height={36} />
              </button>
            )}
          </div>
        )}
        {expanded && (
          <div className="row__expanded">
            {items.map((item, i) => (
              <div className="row__expanded-slot" key={item.id}>
                <Card
                  item={item}
                  rank={top10 ? i + 1 : undefined}
                  progress={progressMap[item.id]}
                  variant={rowVariant}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
