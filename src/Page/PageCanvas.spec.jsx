import React from 'react';
import { mount } from 'enzyme';

import { pdfjs } from '../entry.jest';

import { PageCanvasInternal as PageCanvas } from './PageCanvas';

import failingPage from '../../__mocks__/_failing_page';

import {
  loadPDF, makeAsyncCallback, muteConsole, restoreConsole,
} from '../../test-utils';

const pdfFile = loadPDF('./__mocks__/_pdf.pdf');

/* eslint-disable comma-dangle */

describe('PageCanvas', () => {
  // Loaded page
  let page;

  beforeAll(async () => {
    const pdf = await pdfjs.getDocument({ data: pdfFile.arrayBuffer }).promise;

    page = await pdf.getPage(1);
  });

  describe('loading', () => {
    it('renders a page and calls onRenderSuccess callback properly', async () => {
      const { func: onRenderSuccess, promise: onRenderSuccessPromise } = makeAsyncCallback();

      const pageWithRendererMocked = {
        ...page,
        getAnnotations: () => {},
        getTextContent: () => {},
        getViewport: () => ({
          width: 0,
          height: 0,
        }),
        render: () => ({
          promise: new Promise((resolve) => resolve()),
        }),
      };

      mount(
        <PageCanvas
          onRenderSuccess={onRenderSuccess}
          page={pageWithRendererMocked}
        />
      );

      expect.assertions(1);

      await expect(onRenderSuccessPromise).resolves.toMatchObject({});
    });

    it('calls onRenderError when failed to render canvas', async () => {
      const {
        func: onRenderError, promise: onRenderErrorPromise
      } = makeAsyncCallback();

      muteConsole();

      mount(
        <PageCanvas
          onRenderError={onRenderError}
          page={failingPage}
        />
      );

      expect.assertions(1);

      await expect(onRenderErrorPromise).resolves.toBeInstanceOf(Error);

      restoreConsole();
    });
  });
});
