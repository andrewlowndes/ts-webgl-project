import { BasicDemo } from './BasicDemo';

function load() {
  const canvas = document.createElement('canvas');

  Object.assign(canvas.style, {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  });

  document.body.appendChild(canvas);

  const demo = new BasicDemo(canvas);
   
  window.addEventListener('resize', () => {
    demo.resizeScene();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => load());
} else {
  load();
}
