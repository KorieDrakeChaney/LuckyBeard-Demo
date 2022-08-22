import { NextPage } from "next";
import { ReactNode } from "react";
import {Showcase} from "..";

import styles from "./layout.module.css";

interface Props {
    children: JSX.Element;
}
  

const LayoutContext: NextPage<Props> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
};

const Layout: NextPage = () => {
  return (
    <LayoutContext>
        <Showcase/>
    </LayoutContext>
  );
};

export default Layout;