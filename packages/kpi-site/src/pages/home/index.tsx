/* eslint-disable import/no-extraneous-dependencies */
import { NavLink } from 'react-router-dom'
import styles from './style.module.scss'

export default function Home() {
  return (
    <div className={styles['app-home']}>
      <span className={styles['app-home__title']}>
        <NavLink className={styles['app-home__link']} to="/components">
          KPI UI
        </NavLink>
      </span>
    </div>
  )
}
