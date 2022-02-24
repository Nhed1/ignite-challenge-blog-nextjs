import { ReactElement } from 'react';
import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.image}>
          <img src="./images/Logo.svg" alt="Logo Spacetraveling" />
        </div>
      </header>
    </>
  );
}
