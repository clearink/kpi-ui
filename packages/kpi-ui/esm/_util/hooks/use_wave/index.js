import { useEffect, useRef } from 'react';
import './style.scss';
import Wave from './wave'; // TODO: 待优化 对 mui 和 antd 的动画效果都不太满意

export default function useWave() {
  var ref = useRef(null); // 事件

  useEffect(function () {
    var dom = ref.current;
    if (!dom) return;
    var wave = new Wave(dom);
    dom.addEventListener('mouseup', function () {
      return wave.createWave();
    });
    return function () {
      return wave.destroy();
    };
  }, []);
  return ref;
}