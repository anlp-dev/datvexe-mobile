import React from "react";
import { Image, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";

const bannerData = [
  require('../../../assets/banner1.png'),
  require('../../../assets/banner2.png'),
  require('../../../assets/banner3.jpg'),
  require('../../../assets/banner4.jpg')
];

const Banner = () => {
  return (
    <Swiper
      showsPagination={false}
      autoplay={true}
      loop={true}
      height={200}
      activeDotColor="#FF6347"
    >
      {bannerData.map((image, index) => (
        <Image key={index} source={image} style={styles.bannerImage} />
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
    opacity: 0.9,  
  },
})

export default Banner;
