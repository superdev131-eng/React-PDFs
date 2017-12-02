import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './annotation_layer_builder.css';

import { makeCancellable } from './shared/util';

import { linkServiceProp, pageProp, rotateProp } from './shared/propTypes';

export default class PageAnnotations extends Component {
  componentDidMount() {
    this.getAnnotations();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (
      nextProps.page !== props.page ||
      nextProps.renderInteractiveForms !== props.renderInteractiveForms
    ) {
      this.getAnnotations(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.runningTask && this.runningTask.cancel) {
      this.runningTask.cancel();
    }
  }

  get viewport() {
    const { page, rotate, scale } = this.props;

    return page.getViewport(scale, rotate);
  }

  getAnnotations(props = this.props) {
    this.runningTask = makeCancellable(props.page.getAnnotations());

    return this.runningTask.promise.then((annotations) => {
      this.renderAnnotations(annotations);
    });
  }

  renderAnnotations(annotations) {
    const { linkService, page, renderInteractiveForms } = this.props;
    const viewport = this.viewport.clone({ dontFlip: true });

    const parameters = {
      annotations,
      div: this.annotationLayer,
      linkService,
      page,
      renderInteractiveForms,
      viewport,
    };

    PDFJS.AnnotationLayer.render(parameters);
  }

  render() {
    return (
      <div
        className="ReactPDF__Page__annotations annotationLayer"
        ref={(ref) => { this.annotationLayer = ref; }}
      />
    );
  }
}

PageAnnotations.propTypes = {
  linkService: linkServiceProp,
  page: pageProp,
  renderInteractiveForms: PropTypes.bool,
  rotate: rotateProp,
  scale: PropTypes.number,
};
