import { RenderingCancelledException } from 'pdfjs-dist/es5/build/pdf';

export default {
  _pdfInfo: {
    fingerprint: 'a62067476e69734bb8eb60122615dfbf',
    numPages: 4,
  },
  fingerprint: 'a62067476e69734bb8eb60122615dfbf',
  getDestination: () => new Promise((resolve, reject) => reject(new RenderingCancelledException())),
  getOutline: () => new Promise((resolve, reject) => reject(new RenderingCancelledException())),
  getPage: () => new Promise((resolve, reject) => reject(new RenderingCancelledException())),
  numPages: 4,
};
