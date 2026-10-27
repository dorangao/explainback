import {validateLesson} from './lesson-schema.mjs';
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
export function demoReview(draft,chapter,index,{language,busy,pending,dirty,changed,status}){
 const d=chapter.demo,say=(en,zh)=>language==='zh'?zh:en,box=el('details');box.className='ls-definition';box.open=true;
 box.append(el('summary',say('Review the generated demo','审阅生成的演示')),
  el('p',d.kind==='model'?say('Structure and arithmetic checked. Equations, units, assumptions and causal explanations still need your review.','已检查结构与算术。公式、单位、假设与因果解释仍需要你审阅。'):say('Structure checked. Review the authored steps, assumptions and answer; their factual accuracy is not independently verified.','已检查结构。请审阅创作的步骤、假设与答案；其事实准确性未经独立验证。')),
  el('p',d.assumptions[language]));
 if(d.kind==='model'){
  box.append(el('p',`${d.axis.label[language]}: ${d.axis.min} → ${d.axis.max} ${d.axis.unit} (x)`));
  const list=el('ul');for(const v of d.inputs)list.append(el('li',`${v.label[language]} (${v.id}): ${v.min} → ${v.max} ${v.unit}; ${say('initial','初值')} ${v.value}`));box.append(list);
  for(const o of d.outputs)box.append(el('p',`${o.label[language]} (${o.unit})`),el('code',`${o.id} = ${o.expression}`));
 }else{
  const list=el('ol');for(const s of d.stages)list.append(el('li',`${s.title[language]} — ${s.detail[language]}`));box.append(list);
  const quiz=el('details');quiz.append(el('summary',say('Review the authored answer','审阅创作的答案')),el('p',d.transfer.question[language]),el('p',d.transfer.choices[d.transfer.answer][language]),el('p',d.transfer.rationale[language]));box.append(quiz);
 }
 const advanced=el('details'),label=el('label'),input=el('textarea'),apply=el('button',say('Validate & apply definition','验证并应用定义')),cancel=el('button',say('Discard definition edits','放弃定义编辑'));
 advanced.append(el('summary',say('Edit formulas, controls or steps (JSON)','编辑公式、控件或步骤（JSON）')));label.append(el('span',say('Bilingual demo definition','双语演示定义')),input);input.value=pending.get(chapter)??JSON.stringify(d,null,2);input.maxLength=24000;input.rows=12;input.disabled=busy;apply.type=cancel.type='button';apply.disabled=cancel.disabled=busy;
 input.addEventListener('input',()=>{pending.set(chapter,input.value);dirty();});
 apply.addEventListener('click',()=>{if(busy)return;try{const candidate={...chapter,demo:JSON.parse(input.value)},lesson=validateLesson({...draft,chapters:draft.chapters.map((c,i)=>i===index?candidate:c)});chapter.demo=lesson.chapters[index].demo;pending.delete(chapter);dirty();changed();}catch{status(say('Definition rejected. Check both languages, field names, ranges and formulas. Your last valid definition is preserved.','定义未通过。请检查双语文字、字段、范围和公式。上一次有效定义已保留。'));}});
 cancel.addEventListener('click',()=>{if(!busy){pending.delete(chapter);input.value=JSON.stringify(chapter.demo,null,2);dirty();}});
 advanced.append(label,apply,cancel);box.append(advanced);return box;
}
