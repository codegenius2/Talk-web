// import {useEffect, useRef, useState} from 'react';
// import WaveSurfer from 'wavesurfer.js';
// import RecordPlugin from 'wavesurfer.js/plugins/record'
//
// type Color = {
//     boxBg: string
//     playBg: string
//     play: string
//     pause: string
//     wave: string
//     progress: string
//     hoverLine: string
//     labelBg: string
//     label: string
// }
//
// const selfColor: Color = {
//     boxBg: 'bg-blue-600',
//     playBg: 'bg-blue-grey',
//     play: 'white',
//     pause: 'text-white',
//     wave: 'rgb(128, 154, 241)',
//     progress: 'rgb(213, 221, 250)',
//     hoverLine: 'white',
//     labelBg: '#94a3b8',
//     label: 'white',
// }
//
// const Recorder = () => {
//     const playRef = useRef(null);
//     const [recorder, setRecorder] = useState<RecordPlugin>();
//     const [ws, setWs] = useState<WaveSurfer | undefined>(undefined);
//     const [recording, setRecording] = useState(false);
//
//     useEffect(() => {
//         const rec = RecordPlugin.create()
//         rec.on('record-end', (blob: Blob) => {
//             const recordedUrl = URL.createObjectURL(blob);
//             if (playRef.current) {
//                 if (ws !== undefined) {
//                     ws.destroy()
//                 }
//                 const newWs = myWave(playRef.current!, recordedUrl)
//                 newWs.on('interaction', () => newWs.playPause());
//                 setWs(newWs)
//                 // stop mic on safari to remove the red mic icon
//                 // recorder.stopMic()
//             }
//         });
//         setRecorder(rec)
//     }, []);
//
//     const handleRecord = () => {
//         if (recorder) {
//             if (recorder.isRecording()) {
//                 recorder.stopRecording();
//                 setRecording(false);
//                 return;
//             }
//
//             recorder.startRecording().then(() => {
//                 setRecording(true);
//             });
//         }
//     };
//
//     return <div className="flex flex-col rounded-2xl items-center p-1 gap-2">
//         <div className={"flex justify-center items-center rounded-2xl w-full h-10 shrink-0 bg-white"}
//              onClick={handleRecord}>
//             <div>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
//                      stroke="currentColor" className="w-6 h-6">
//                     <path strokeLinecap="round" strokeLinejoin="round"
//                           d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
//                 </svg>
//             </div>
//         </div>
//         <div ref={playRef} className="w-full h-10"/>
//     </div>
// };
//
// function myWave(micRef: HTMLDivElement, url?: string) {
//     return WaveSurfer.create({
//         container: micRef,
//         waveColor: selfColor.wave,
//         progressColor: selfColor.progress,
//         // cursorWidth: 0,
//         barWidth: 4,
//         barGap: 2,
//         barRadius: 10,
//         height: 'auto',
//         url: url
//     });
// }
//
// export default Recorder;
//
