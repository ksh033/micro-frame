import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./index.less";

const BsViemImage: React.FC<any> = (props) => {
  const { pageProps } = props;
  const [current, setCurrent] = useState(0);
  const ref = useRef<any>();
  const { imageList } = pageProps;
  const length = Array.isArray(imageList) ? imageList.length : 0;

  const showImage = () => {
    const imgs: React.ReactNode[] = [];
    if (Array.isArray(imageList)) {
      imageList.forEach((item: any, index: number) => {
        imgs.push(
          <div key={index} className={styles["bs-view-image-item"]}>
            <img src={item.url} key={`img${index}`} alt="" />
          </div>
        );
      });
    }
    return imgs;
  };

  useEffect(() => {
    return () => {
      setCurrent(0);
    };
  }, []);

  const afterChange = (_current: number) => {
    setCurrent(_current);
  };

  const hasNext = length > 1 && current < length - 1;

  const hasPre = current > 0;

  const toPre = () => {
    ref.current.slick.slickPrev();
  };

  const toNext = () => {
    ref.current.slick.slickNext();
  };
  return (
    <div>
      {hasPre ? (
        <LeftOutlined
          className={styles["bs-view-image-left"]}
          onClick={toPre}
        />
      ) : null}

      <Carousel
        className={styles["bs-view-image"]}
        afterChange={afterChange}
        ref={ref}
      >
        {showImage()}
      </Carousel>

      {hasNext ? (
        <RightOutlined
          className={styles["bs-view-image-right"]}
          onClick={toNext}
        />
      ) : null}
    </div>
  );
};

export default BsViemImage;
