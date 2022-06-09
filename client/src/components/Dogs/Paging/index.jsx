import React from "react";
import style from "./paging.module.css";

export default function Paging({ charactersPerPage, allCharacter, Paginited }) {
  const pageNumber = [];

  for (let i = 1;i <= Math.ceil(allCharacter/ charactersPerPage);i++ ) {
    pageNumber.push(i);
  }
  return (
    <nav className={style.pagesList}>
        {pageNumber &&
          pageNumber.map((number) => (
            <nav key={number}  onClick={() => Paginited(number)} className={style.num}>
              {number}
            </nav>
          ))}
    </nav>
  );
}
