import React, { Component } from "react";
import Annotation from "react-image-annotation";

export default class ImageAnnotation extends Component {
  state = {
    annotations: [],
    annotation: {},
  };

  onChange = (annotation) => {
    this.setState({ annotation });
  };

  onSubmit = (annotation) => {
    const { geometry, data } = annotation;

    this.setState({
      annotation: {},
      annotations: this.state.annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      }),
    });
  };

  render() {
    const { imageSrc } = this.props;

    return (
      <Annotation
        src={imageSrc}
        alt="Annotated Image"
        annotations={this.state.annotations}
        value={this.state.annotation}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        allowTouch
      />
    );
  }
}
