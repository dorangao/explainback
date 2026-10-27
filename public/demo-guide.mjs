// Short teaching notes; numerical evidence remains in the checked model and provider response.
export const guideStages=['claim','confirm','prediction','evidence','acceleration','flip','landing','revision','transfer','complete'];
const notes={
 en:{
 claim:['Start with a testable claim','“A complete flip that starts and ends at rest needs no torque.” Is that true throughout the turn?','The car is at the starting line. Graphs unlock after a prediction.','Next sends this preset to the model for interpretation; it does not check the physics yet.','Interpret the claim'],
 confirm:['Read the interpretation','Check the proposed claim and its scope in the preset feedback below. This demo confirms it as a script.','The motion is still paused. Confirming meaning does not make the claim true.','Next records scripted confirmation locally. No provider call.','Confirm the script'],
 prediction:['Predict before checking','The preset predicts that zero net angular impulse means zero torque at every instant.','Look for positive and negative regions in the torque graph once the evidence appears.','Next asks the model to select the bounded experiment; code checks the curve.','Test the prediction'],
 evidence:['Read the checked evidence','Starting and ending with zero angular speed does not require torque to be zero throughout.','Positive torque builds spin; negative torque removes it. Their signed areas cancel.','The animation is now unlocked. Next plays only acceleration, then pauses.','Play acceleration'],
 acceleration:['Acceleration → pause','How does a smooth speed increase change force? The car follows a prescribed cosine acceleration pulse.','Speed’s slope is acceleration; force is mass × acceleration. Choose Drive force to see the pulse.','At 5 s the car reaches 60 mph. Smooth joins need nonzero force between them; this is a target curve, not proof of real feasibility.','Play the flip'],
 flip:['Flip → pause','A turn can finish upright and at rest even though torque acted during the turn.','The torque graph rises above and below zero. Both lobes are needed for this controlled rest-to-rest flip.','At 6.5 s the turn is complete. The model assumes an external torque couple and a launch impulse; no real takeoff mechanism is tested.','Play the landing'],
 landing:['Landing → pause','Does upright orientation alone guarantee a gentle landing? No: vertical motion must also stop.','Contact force includes weight: N = mg + ma. The pulse has a peak above its average.','At 6.8 s vertical speed is zero. Horizontal speed continues; suspension, occupant loads and post-touchdown rotation are not modeled.','Revise the claim'],
 revision:['Explain what changed','Replace “zero torque throughout” with “positive then negative torque, with zero net angular impulse.”','Use the completed torque curve as evidence. Angle, angular speed and torque are different quantities.','Next submits the revised preset and requests a fresh problem.','Submit the revision'],
 transfer:['Apply it to new numbers','The worked preset below uses the fresh problem’s mass, timing and inertia.','The animation stays as PRIMARY REFERENCE ONLY. Its 2000 kg / 1.5 s flip values are not the transfer values.','Next submits the fresh numerical answers and explanation. Presets and visible provider context make this assisted.','Check the transfer'],
 complete:['Result: compare the reasoning','The original zero-torque claim has been revised using signed torque and angular impulse.','Keep exploring the primary reference animation; the fresh transfer result is in the feedback and console.','Values and reasoning were checked. This scripted, assisted result does not establish independent learning or a safe real-world stunt.','Finished']
 },
 zh:{
 claim:['从可检验的说法开始','“完整翻转的起点和终点都不旋转，所以全过程不需要力矩。”这是真的吗？','汽车停在起点。先预测，再解锁图像。','点击下一步，将预设发给模型解读；此时尚未检验物理结论。','解读说法'],
 confirm:['阅读模型解读','查看下方反馈中的说法与适用范围。本演示会以脚本身份确认解读。','运动仍暂停。确认含义不代表说法正确。','下一步仅在本地记录脚本确认，不调用模型。','确认预设解读'],
 prediction:['先预测，再检验','预设预测：净角冲量为零，就意味着每一瞬间的力矩都为零。','证据出现后，观察力矩图中零线以上和以下的部分。','下一步由模型选择限定实验，再由代码核验曲线。','检验预测'],
 evidence:['阅读已核验的证据','起点和终点的角速度都为零，并不要求全过程力矩为零。','正力矩增加旋转，负力矩减少旋转；两部分的有符号面积抵消。','动画已解锁。下一步只播放加速阶段，结束后暂停。','播放加速'],
 acceleration:['加速 → 暂停','速度平滑增加时，力如何变化？汽车按规定的余弦加速度脉冲运动。','速度曲线的斜率是加速度；力等于质量乘加速度。可选择“驱动力”查看脉冲。','5 秒时达到 60 mph。平滑衔接仍需要过程中有非零力；目标曲线不证明实车可行。','播放翻转'],
 flip:['翻转 → 暂停','翻转结束时可以回正且停止旋转，但过程中仍有力矩。','力矩图先在零线上方，再在下方。受控的静止到静止翻转需要这两部分。','6.5 秒时完成翻转。模型假设理想外力偶和起飞冲量，没有检验真实起跳机构。','播放着陆'],
 landing:['着陆 → 暂停','姿态回正就一定着陆平稳吗？不够，还要制停竖直运动。','接触力包含重力：N = mg + ma。脉冲峰值高于平均值。','6.8 秒时竖直速度为零，水平速度仍保持。不模拟悬架、乘员载荷或接地后的旋转。','修正说法'],
 revision:['解释认识的变化','把“全过程力矩为零”改为“先正后负的力矩，净角冲量为零”。','用已播放的力矩曲线作证据。角度、角速度和力矩是不同的量。','下一步提交修正预设，并获取一道新题。','提交修正'],
 transfer:['换一组数值再应用','下方例解使用新题自己的质量、时间与转动惯量。','动画仅为初始示例参考。2000 kg、1.5 秒翻转参数不属于迁移题。','下一步提交新题数值和解释。预设及可见模型上下文使结果计为辅助完成。','检验迁移'],
 complete:['结果：对照前后推理','用有符号力矩和角冲量，修正了原先“力矩为零”的说法。','可以继续探索初始参考动画；新题结果在反馈及控制台中。','数值与推理已核验。这是脚本辅助结果，不证明独立掌握，也不证明实车特技安全。','已完成']
 }
};
export function demoGuide(stage,language){return (notes[language]??notes.en)[stage]??null;}
