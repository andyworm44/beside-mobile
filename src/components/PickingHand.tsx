import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

interface PickingHandProps {
  scale?: number;
  color?: string;
  onPick?: () => void;
}

const PickingHand: React.FC<PickingHandProps> = ({ scale = 2, color = '#F8D7C8', onPick }) => {
  // 動畫值：0 是放鬆狀態，1 是摳手狀態
  const pickAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (onPick) onPick();
    
    // 觸發強烈震動，增加回饋感
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // 執行動畫：快速摳進去 -> 稍微停頓 -> 彈回來
    pickAnim.setValue(0);
    Animated.sequence([
      Animated.timing(pickAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.spring(pickAnim, {
        toValue: 0,
        tension: 150,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 大拇指動作插值
  const thumbRotate = pickAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'], // 向內旋轉
  });
  
  const thumbTranslateX = pickAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8], // 往食指靠近
  });

  const thumbTranslateY = pickAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4], // 稍微往下
  });

  const thumbScale = pickAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.95, 1] // 擠壓變形
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchArea}>
        <Svg width={100 * scale} height={100 * scale} viewBox="0 0 100 100">
          
          {/* 手掌本體 (食指側邊) */}
          <Path
            d="M40,90 
               Q20,80 20,60 
               L20,30 Q20,10 40,10 
               L40,50 
               Q40,60 50,60
               L50,90 Z"
            fill={color}
            stroke="#E0B0A0"
            strokeWidth="1.5"
          />
          
          {/* 食指關節紋路 */}
          <Path
             d="M25,50 Q30,50 35,48"
             stroke="#D09080"
             strokeWidth="1"
             fill="none"
          />
        </Svg>

        {/* 大拇指作為獨立圖層覆蓋在上面，方便做動畫 */}
        <Animated.View 
            style={[
                styles.thumbContainer, 
                { 
                    width: 100 * scale, 
                    height: 100 * scale,
                    transform: [
                        { translateX: thumbTranslateX }, 
                        { translateY: thumbTranslateY },
                        { rotate: thumbRotate },
                        { scale: thumbScale }
                    ] 
                }
            ]}
            pointerEvents="none"
        >
             <Svg width={100 * scale} height={100 * scale} viewBox="0 0 100 100">
                {/* 大拇指形狀 */}
                <Path
                    d="M15,60
                       Q5,50 15,40
                       L35,45
                       Q40,55 35,65
                       L15,60 Z"
                    fill={color}
                    stroke="#E0B0A0"
                    strokeWidth="1.5"
                    transform="translate(10, 5)" 
                />
                {/* 指甲 */}
                <Path
                    d="M18,45 Q22,42 26,44 Q25,48 18,45"
                    fill="#FFE5DC"
                    stroke="#D09080"
                    strokeWidth="0.5"
                    transform="translate(10, 5)"
                />
             </Svg>
        </Animated.View>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

export default PickingHand;
