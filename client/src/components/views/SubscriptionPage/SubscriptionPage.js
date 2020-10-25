import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';

function SubscriptionPage(props) {
  const [Videos, setVideos] = useState([]);

  useEffect(() => {
    const fn = async () => {
      try {
        const subscriptionVariable = {
          userFrom: localStorage.getItem('userId'),
        };

        const res = await axios.post(
          '/api/video/getSubscriptionVideos',
          subscriptionVariable
        );

        setVideos(res.data.videos);
      } catch (e) {
        console.log('error?');
        console.error(e);
      }
    };
    fn();
  }, []);

  const renderVideos = Videos.map((video, index) => {
    const hours = Math.floor(video.duration / 3600);
    const minutes = Math.floor((video.duration - hours * 3600) / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col xs={12} sm={6} md={4} lg={3} xl={2}>
        <LinkContainer
          exact
          to={`/video/${video._id}`}
          style={{ cursor: 'pointer' }}
        >
          <Card key={video._id}>
            <div style={{ position: 'relative' }}>
              <Card.Img
                variant="top"
                src={`http://localhost:5000/${video.thumbnail}`}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(200, 200, 200, 0.8)',
                    padding: '5px',
                  }}
                >
                  {hours} : {minutes} : {seconds}
                </div>
              </div>
            </div>

            <Card.Body>
              <Card.Title>{video.title}</Card.Title>
              <Card.Text>{video.writer.name}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small>{video.views} Views</small>
              <br />
              <small className="text-muted">
                {moment(video.createdAt).format('MMM-Do YYYY')}
              </small>
            </Card.Footer>
          </Card>
        </LinkContainer>
      </Col>
    );
  });

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1>Subscription</h1>
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Row>{renderVideos}</Row>
      </Container>
    </>
  );
}

export default SubscriptionPage;
