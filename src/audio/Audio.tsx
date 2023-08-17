
function Audio(blob:Blob[]){

// 将音频数据的字节数组转换为 Blob 对象
const blob = new Blob([], { type: 'audio/mp3' }); // 这里假设音频数据是 MP3 格式

// 创建一个 URL 对象，用于将 Blob 对象转换为可播放的 URL
const audioUrl = URL.createObjectURL(blob);

// 创建 <audio> 元素
const audioElement = document.createElement('audio');
audioElement.src = audioUrl;

// 将 <audio> 元素添加到页面中的某个容器中
const container = document.getElementById('audio-container');
container.appendChild(audioElement);


}