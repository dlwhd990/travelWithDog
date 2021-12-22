import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ItemSlickFour from "../slick/itemSlickFour/itemSlickFour";
import ItemSlickOne from "../slick/itemSlickOne/itemSlickOne";
import ItemSlickThree from "../slick/itemSlickThree/itemSlickThree";
import ItemSlickTwo from "../slick/itemSlickTwo/itemSlickTwo";
import styles from "./categoryPage.module.css";

const CategoryPage = ({ categoryList }) => {
  const [category, setCategory] = useState(null);
  const { path } = useParams();

  useEffect(() => {
    categoryList.forEach((cate) => {
      if (cate.route === path) {
        console.log(cate);
        setCategory(cate);
        return false;
      }
    });
  }, [path]);

  return (
    <main className={styles.main}>
      <div className={styles.top_banner}>
        <div className={styles.top_filter}>
          <p className={styles.title}>{category && category.title}</p>
          <p className={styles.subtitle}>{category && category.subtitle}</p>
        </div>
      </div>
      <div className={styles.list_part}>
        {category &&
          category.cardList.map((item) =>
            item.type === 1 ? (
              <div key={item.id} className={styles.list_container}>
                <p className={styles.list_title}>{item.title}</p>
                <ItemSlickOne viewItems={item.data} />
              </div>
            ) : item.type === 2 ? (
              <div key={item.id} className={styles.list_container}>
                <p className={styles.list_title}>{item.title}</p>
                <ItemSlickTwo viewItems={item.data} />
              </div>
            ) : item.type === 3 ? (
              <div key={item.id} className={styles.list_container}>
                <p className={styles.list_title}>{item.title}</p>
                <ItemSlickThree viewItems={item.data} />
              </div>
            ) : item.type === 4 ? (
              <div key={item.id} className={styles.list_container}>
                <p className={styles.list_title}>{item.title}</p>
                <ItemSlickFour viewItems={item.data} />
              </div>
            ) : (
              <></>
            )
          )}
      </div>
    </main>
  );
};

export default CategoryPage;