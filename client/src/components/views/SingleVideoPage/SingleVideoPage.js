import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function LandingPage(props) {
  const videoId = props.match.params.videoId;
  const variable = {
    videoId: videoId,
  };
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await axios.post('/api/video/getVideo', variable);
        console.log(res.data);
        setVideo(res.data.video);
      } catch (e) {
        console.log(e);
      }
    };
    fn();
  }, [videoId]);

  if (Video.writer) {
    let SubscribeBtn = Video.writer._id !== localStorage.getItem('userId') && (
      <Subscribe
        userTo={Video.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );

    return (
      <>
        <Container fluid="xl" className="px-lg-5">
          <Row noGutters>
            <Col sm={8} lg={9} className="bg-light">
              <div className="w-100">
                <video
                  className="w-100"
                  src={`http://localhost:5000/${Video.filePath}`}
                  controls
                />
              </div>
              {/* Info */}
              <div>
                {Video.title}
                <br />
                {Video.description}
                <br />
                {Video.writer.name}
                <br />
                {moment(Video.createdAt).format('MMM-Do YYYY')}
                <br />
                {SubscribeBtn}
              </div>
              {/* Comment */}

              <Comment />
            </Col>
            <Col sm={4} lg={3} className="bg-light">
              <SideVideo />
            </Col>
          </Row>
        </Container>
      </>
    );
  } else {
    return <div>Now Loading...</div>;
  }
}

export default withRouter(LandingPage);
