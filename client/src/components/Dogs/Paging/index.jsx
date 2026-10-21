import React from "react";
import style from "./paging.module.css";

const VISIBLE_PAGES = 5;

export default function Paging({ charactersPerPage, allCharacter, Paginited, currentPage }) {
  const totalPages = Math.ceil(allCharacter / charactersPerPage);

  if (totalPages === 0) return null;

  // Ventana de 5 números centrada en la página actual, sin salirse del rango
  const half = Math.floor(VISIBLE_PAGES / 2);
  let start = Math.max(1, Math.min(currentPage - half, totalPages - VISIBLE_PAGES + 1));
  let end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
  const pageNumbers = [];
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  const goTo = (page) => {
    if (page >= 1 && page <= totalPages) Paginited(page);
  };

  return (
    <div className={style.pagination}>
      <div className={style.selectRow}>
        <label htmlFor="page-select" className={style.selectLabel}>Ir a página</label>
        <select
          id="page-select"
          className={style.select}
          value={currentPage}
          onChange={(e) => goTo(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <option key={number} value={number}>
              {number} de {totalPages}
            </option>
          ))}
        </select>
      </div>

      <nav className={style.pagesList}>
        <button
          type="button"
          className={style.arrow}
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          ‹
        </button>

        {pageNumbers.map((number) => (
          <button
            type="button"
            key={number}
            onClick={() => goTo(number)}
            className={`${style.num} ${currentPage === number ? style.active : ''}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          className={style.arrow}
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </nav>
    </div>
  );
}
