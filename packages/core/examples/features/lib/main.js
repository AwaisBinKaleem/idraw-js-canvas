import { getData } from './data/index.js';
import { doScale } from './scale.js';
import { doScroll } from './scroll.js';
import { doElemens } from './element.js';

const Core = window.iDrawCore;
const data = getData();
const mount = document.querySelector('#mount');

const defaultConf = {
  scale: 1.5,
  scrollLeft: 100,
  scrollTop: 50,
};
const core = new Core(mount, {
  width: 600,
  height: 400,
  contextWidth: 600,
  contextHeight: 400,
  devicePixelRatio: 4,
}, {
  scrollWrapper: {
    use: true,
    lineWidth: 16,
    color: '#9c27b0',
  },
  elementWrapper: {
    lockColor: '#009688',
    color: '#e91e63',
    dotSize: 8,
    lineWidth: 1,
    lineDash: [12, 12],
  },
});


core.on('error', (data) => {
  console.log('error: ', data);
});
core.on('changeData', (data) => {
  console.log('changeData: ', data);
});
core.on('changeScreen', (data) => {
  console.log('changeScreen: ', data);
});
core.on('screenSelectElement', (data) => {
  console.log('screenSelectElement: ', data);
});
core.on('screenMoveElementStart', (data) => {
  console.log('screenMoveElementStart: ', data);
});
core.on('screenMoveElementEnd', (data) => {
  console.log('screenMoveElementEnd: ', data);
});
core.on('screenChangeElement', (data) => {
  console.log('screenChangeElement: ', data);
});


core.setData(data);

doScale(core, defaultConf.scale);
doScroll(core, defaultConf);
doElemens(core);
