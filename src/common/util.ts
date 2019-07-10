type kList = 'M+' | 'd+' | 'h+' | 'm+' | 's+'

interface Ointerface {
  'M+': string | number
  'd+': string | number
  'h+': string | number
  'm+': string | number
  's+': string | number
}

export function formatDate(date: Date, fmt: string) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o: Ointerface = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k as kList] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str: string): string {
  return ('00' + str).substr(str.length);
}
