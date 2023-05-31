export const isMultimedia = (url: string) => {
  if (url) {
    let num = url.lastIndexOf("/") + 1;
    let file = url.substring(num);
    if (file) {
      return (
        /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(file) ||
        /\.(mp4|rmvb|avi|ts)$/.test(file)
      );
    }
    return false;
  }
  return false;
};

export const isImageFileType = (type: string): boolean =>
  type.indexOf("image/") > -1;

export const getFileName = (url: string) => {
  if (url) {
    let num = url.lastIndexOf("/") + 1;
    return url.substring(num);
  }
  return "";
};
