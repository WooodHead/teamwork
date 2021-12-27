export default {
  files: [],
  // 是否分页
  byPage: false,
  page: {
    offset: 0,
    limit: 3,
    nextPageToken: 0
  },
  // 模糊查询
  search: '',
  // 排序
  sort: ['orderNumber', 'id'],
  // 可预览文件格式
  imgExts: ['.img', '.png', '.jpg', '.bmp', '.gif', '.jpeg', '.gif',
    'img', 'png', 'jpg', 'bmp', 'gif', 'jpeg', 'gif'],
  pdfExts: ['.pdf', 'pdf'],
  threeDExts: ['.stl', '.obj', '.dae', '.json', '.ply', '.gltf', '.fbx',
    'stl', 'obj', 'dae', 'json', 'ply', 'gltf', 'fbx'],
  videoExts: ['.mp4', '.mov',
    'mp4', 'mov'],
  audioExts: ['.mp3', '.wav', '.aac', '.flac', '.ogg',
    'mp3', 'wav', 'aac', 'flac', 'ogg'],
  // 文档预览格式
  officePreviewExts: ['.pptx', '.ppt', '.xls', '.xlt', '.xlsx', '.xltx', '.csv',
    '.doc', '.wps', '.docx', '.txt',
    'pptx', 'ppt', 'xls', 'xlt', 'xlsx', 'xltx', 'csv',
    'doc', 'wps', 'docx', 'txt'],
  // 上传文件时，拍照、录像、录音配置数组
  uploaderSettings: [
    { id: 'file', icon: 'insert_drive_file', accept: '' },
    { id: 'image', icon: 'camera_alt', accept: 'image/*', capture: 'camera' },
    { id: 'video', icon: 'videocam', accept: 'video/*', capture: 'camcorder' }
    // { id: 'audio', icon: 'perm_camera_mic', accept: 'audio/*', capture: 'microphone' }
  ],
  visitRecordPage: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  downloadRecordPage: {
    offset: 0,
    limit: 20,
    nextPageToken: 0
  },
  visitRecords: [],
  downloadRecords: []
}
