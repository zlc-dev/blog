export type AplayerAudio = {
    name: string;          // 歌名（必填）
    artist: string;        // 艺术家（必填）
    url: string;           // 音频地址（必填，CDN / 本地）
    cover?: string;        // 封面
    lrc?: string;          // 歌词（lrc 文件或字符串）
    theme?: string;        // 单曲主题色
    type?: 'auto' | 'hls' | 'normal'; // 音频类型
};
