import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  CardDeck,
  Card,
  Image,
} from 'react-bootstrap';
import moment from 'moment';
import { LinkContainer } from 'react-router-bootstrap';

function SideVideo(props) {
  const [Videos, setVideos] = useState([]);

  useEffect(() => {
    const fn = async () => {
      try {
        const res = await axios.get('/api/video/getVideos');

        setVideos(res.data.videos);
      } catch (e) {
        console.error(e);
      }
    };
    fn();
  }, []);

  const renderSideVideos = Videos.map((video, index) => {
    const hours = Math.floor(video.duration / 3600);
    const minutes = Math.floor((video.duration - hours * 3600) / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div key={index} className="d-flex mb-2 p-1">
        <div className="w-50" style={{ position: 'relative' }}>
          <Link to={`/video/${video._id}`}>
            <Image
              src={`http://localhost:5000/${video.thumbnail}`}
              className="w-100"
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
          </Link>
        </div>
        <div className="w-50">
          {video.title} <br />
          {moment(video.createdAt).format('MMM-Do YYYY')} <br />
          Views {video.views}
          <br />
        </div>
      </div>
    );
  });

  return <section>{renderSideVideos}</section>;
}

export default withRouter(SideVideo);
