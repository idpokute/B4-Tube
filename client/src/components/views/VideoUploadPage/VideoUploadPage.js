import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { PlusCircle } from 'react-bootstrap-icons';
import Axios from 'axios';

const PrivateOptions = [
  {
    value: 0,
    label: 'Private',
  },
  {
    value: 1,
    label: 'Public',
  },
];

const CategoryOptions = [
  {
    value: 0,
    label: 'Kids',
  },
  {
    value: 1,
    label: 'Animation',
  },
  {
    value: 2,
    label: 'Vlog',
  },
  {
    value: 3,
    label: 'Food',
  },
];

function VideoUploadPage(props) {
  const user = useSelector(state => state.user);

  const [VideoTitle, setVideoTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState(0);
  const [FilePath, setFilePath] = useState('');
  const [Duration, setDuration] = useState('');
  const [ThumbnailPath, setThumbnailPath] = useState('');
  const [UploadResult, setUploadResult] = useState(false);

  const onTitleChange = e => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescriptionChange = e => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = e => {
    setPrivate(e.currentTarget.value);
  };
  const onCategoryChange = e => {
    setCategory(e.currentTarget.value);
  };
  const onDrop = files => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    const fn = async () => {
      try {
        const res = await Axios.post(
          '/api/video/uploadfiles',
          formData,
          config
        );

        if (res.data.success) {
          setFilePath(res.data.url);

          let variable = {
            url: res.data.url,
            fileName: res.data.fileName,
          };

          Axios.post('/api/video/thumbnail', variable).then(response => {
            if (response.data.success) {
              setDuration(response.data.fileDuration);

              console.log(response.data.url);

              setThumbnailPath(response.data.url);
            } else {
              alert('Generate thumbnail image fail');
            }
          });
        }
      } catch (e) {
        alert('Fail upload a file.');
        console.log(e);
      }
    };
    fn();
  };

  const onSubmit = e => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    const fn = async () => {
      try {
        const res = await Axios.post('/api/video/uploadVideo', variables);

        if (res.data.success) {
          setUploadResult(true);
          setTimeout(() => {
            props.history.push('/');
          }, 3000);
        } else {
          alert('upload video fail');
        }
      } catch (e) {
        console.log(e);
      }
    };
    fn();
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">Upload Video</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {UploadResult && (
            <Alert key={0} variant="primary">
              Uploaded!
            </Alert>
          )}
          <Form onSubmit={onSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="uploadForm.Dropzone">
                <Dropzone onDrop={onDrop} multiple={false} maxSize={9999999}>
                  {({ getRootProps, getInputProps }) => (
                    <section
                      className="d-flex justify-content-center align-items-center w-100 border "
                      style={{ height: '200px' }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <PlusCircle size={80} />
                    </section>
                  )}
                </Dropzone>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="uploadForm.Thumbnail">
                {ThumbnailPath && (
                  <img
                    src={`http://localhost:5000/${ThumbnailPath}`}
                    alt="thumbnail"
                  />
                )}
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="12" controlId="uploadForm.Title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="For one of my best moments"
                  value={VideoTitle}
                  onChange={onTitleChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="12" controlId="uploadForm.Description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={Description}
                  onChange={onDescriptionChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="12" controlId="uploadForm.Private">
                <Form.Label>Visible</Form.Label>
                <Form.Control
                  as="select"
                  value={Private}
                  onChange={onPrivateChange}
                >
                  {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} md="12" controlId="uploadForm.Category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={Category}
                  onChange={onCategoryChange}
                >
                  {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Button variant="primary" size="lg" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default withRouter(VideoUploadPage);
