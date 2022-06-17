import React from "react";
import { Link } from "react-router-dom";
import style from "./xxx.module.css"

export default function MissLanding() {
  return (
    <div className={style.bkg}>
      <h1 className={style.error}>You have landed on a page that doesn't exist !</h1>
      <h1 className={style.back}>UPS!!</h1>
      <Link to="/home" className={style.back}>
        <h1 className={style.backbtn}>Lets Back</h1>
      </Link>
    </div >
  )
}