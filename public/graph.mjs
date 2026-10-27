import { evaluate } from './math.mjs';
const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs = {}, text) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text !== undefined) node.textContent = text;
  return node;
}
export function drawGraph(container, graph, language, inputX = 0) {
  const w = 640, h = 420, left = 55, right = 610, top = 25, bottom = 365;
  const range = graph?.range ?? [-1, 1];
  const px = x => left + (x + 8) / 16 * (right - left);
  const py = y => bottom - (y - range[0]) / (range[1] - range[0]) * (bottom - top);
  const svg = el('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': graph ? `${graph.expression}; x → −∞: y → ${graph.leftLimit}; x → ∞: y → ${graph.rightLimit}; ${language === 'zh' ? '交点的 x 值' : 'crossing x-values'}: ${graph.crossings.join(', ') || (language === 'zh' ? '无' : 'none')}` : (language === 'zh' ? '图像将在反思后显示' : 'Graph waiting for your reasoning') });
  const defs = el('defs'); const clip = el('clipPath', { id: 'plot-clip' });
  clip.append(el('rect', { x: left, y: top, width: right-left, height: bottom-top })); defs.append(clip); svg.append(defs);
  for (let x = -8; x <= 8; x += 2) {
    svg.append(el('line', { x1:px(x), y1:top, x2:px(x), y2:bottom, stroke:'#dce1d5', 'stroke-width':1 }));
    svg.append(el('text', { x:px(x), y:bottom+24, 'text-anchor':'middle', fill:'#68776c', 'font-size':13 }, x));
  }
  for (let i = 0; i <= 4; i++) {
    const y = range[0] + i/4 * (range[1] - range[0]);
    svg.append(el('line', { x1:left, y1:py(y), x2:right, y2:py(y), stroke:'#dce1d5', 'stroke-width':1 }));
    svg.append(el('text', { x:left-10, y:py(y)+4, 'text-anchor':'end', fill:'#68776c', 'font-size':12 }, Number(y.toFixed(2))));
  }
  svg.append(el('line', { x1:px(0),y1:top,x2:px(0),y2:bottom,stroke:'#98a793' }));
  if (range[0] <= 0 && range[1] >= 0) svg.append(el('line',{x1:left,y1:py(0),x2:right,y2:py(0),stroke:'#98a793'}));
  svg.append(el('text',{x:right,y:bottom+44,fill:'#68776c','font-size':14},'x'));
  if (graph) {
    for (const a of graph.asymptotes) {
      svg.append(el('line',{x1:left,y1:py(a),x2:right,y2:py(a),stroke:'#87986a','stroke-width':2,'stroke-dasharray':'8 7'}));
      svg.append(el('text',{x:right-5,y:py(a)-8,'text-anchor':'end',fill:'#5b7243','font-size':13},`y = ${a}`));
    }
    const samples = Array.from({length:641},(_,i)=>{const x=-8+i/40;return `${i?'L':'M'}${px(x).toFixed(2)},${py(evaluate(graph.formula,x)).toFixed(2)}`;}).join(' ');
    svg.append(el('path',{d:samples,fill:'none',stroke:'#116d60','stroke-width':3.5,'stroke-linecap':'round','clip-path':'url(#plot-clip)'}));
    for(const x of graph.crossings) svg.append(el('circle',{cx:px(x),cy:py(evaluate(graph.formula,x)),r:6,fill:'#116d60',stroke:'#f6f5ef','stroke-width':2}));
    const y=evaluate(graph.formula,inputX);
    svg.append(el('circle',{cx:px(inputX),cy:py(y),r:5,fill:'#20332f','clip-path':'url(#plot-clip)'}));
  } else {
    svg.append(el('text',{x:330,y:185,'text-anchor':'middle',fill:'#82917b','font-size':21,'font-family':'Georgia, serif'},language==='zh'?'先讲出你的想法。':'Your explanation comes first.'));
  }
  container.replaceChildren(svg);
}
