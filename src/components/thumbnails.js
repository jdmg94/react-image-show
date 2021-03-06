import React from 'react';
import { addStyleToHead, removeStyleFromHead } from '../utils/style-sheet.js';

class Thumbnails extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailsTrackStyle: {}
    }
    
    this.styleNodes = this.createCss(props);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  createCss(props) {
    const { thumbnailsWidth } = this.props;
    const mediaString = '@media screen and (min-width: 992px)';
    let styleNodes = [];

    styleNodes.push(addStyleToHead(
      {
        selector: '.slide-show .ss-thumbnails',
        content: `width:${thumbnailsWidth};`
      },
      mediaString
    ));

    return styleNodes;
  }

  componentWillReceiveProps(nextProps) {
    const { activeIndex } = nextProps;
    const left = this.calculateOffsetLeft(activeIndex);
    this.setState({
      thumbnailsTrackStyle: {
        transform: `translateX(${left}px)`,
      }
    })
  }

  componentWillUnmount() {
    removeStyleFromHead(this.styleNodes);
  }

  handleImageClick(e) {
    this.props.goTo(+e.currentTarget.dataset.index);
  }

  calculateOffsetLeft(activeIndex) {
    const totalImage = this.props.images.length;
    const { thumbnailsTrack } = this;
    const trackWidth = thumbnailsTrack.getBoundingClientRect().width;
    const scrollWidth = thumbnailsTrack.scrollWidth;
    const maxScroll = scrollWidth - trackWidth;
    const pixelPerIndex = maxScroll / (totalImage - 1);

    // Number rounding can cause miscalculation, take special care of the last thumbnail
    if (activeIndex === totalImage - 1) {
      return -maxScroll;
    }

    return -activeIndex * pixelPerIndex;
  }

  render() {
    const { images, activeIndex } = this.props;
    const { thumbnailsTrackStyle } = this.state;
    return (
      <div className="ss-thumbnails">
        <div
          className="ss-thumbnails-track" style={thumbnailsTrackStyle}
          ref={thumbnailsTrack => { this.thumbnailsTrack = thumbnailsTrack }}
        >
          {images.map((v, i) => {
            return (
              <div
                key={i}
                className="ss-thumbnail"
                onClick={this.handleImageClick}
                data-index={i}
              >
                <img
                  src={v} alt=""
                  className={activeIndex === i ? "ss-active" : ""}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Thumbnails