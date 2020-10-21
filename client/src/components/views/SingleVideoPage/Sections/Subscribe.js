import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Axios from 'axios';

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fn = async () => {
      try {
        let variable = {
          userTo: props.userTo,
          // userFrom:
        };
        const res = await Axios.post(
          '/api/subscribe/subscribeNumber',
          variable
        );
        setSubscribeNumber(res.data.subscribeNumber);

        // Am I a subscriber of this video author?
        let subscribedVariable = {
          userTo: props.userTo,
          userFrom: localStorage.getItem('userId'),
        };
        const response = await Axios.post(
          '/api/subscribe/subscribed',
          subscribedVariable
        );

        setSubscribed(response.data.subscribed);

        console.log(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fn();
  }, []);

  const onClickSubscribe = e => {
    let subscribeVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom,
    };

    if (Subscribed) {
      Axios.post('/api/subscribe/unsubscribe', subscribeVariable).then(res => {
        if (res.data.success) {
          setSubscribeNumber(SubscribeNumber - 1);
          setSubscribed(!Subscribed);
        } else {
          alert('Subscribe Fail');
        }
      });
    } else {
      Axios.post('/api/subscribe/subscribe', subscribeVariable).then(res => {
        if (res.data.success) {
          setSubscribeNumber(SubscribeNumber + 1);
          setSubscribed(true);
        } else {
          alert('Subscribe Fail');
        }
      });
    }
  };

  return (
    <section>
      <button
        onClick={onClickSubscribe}
        style={{ backgroundColor: `${Subscribed ? '#eee' : 'red'}` }}
      >
        {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
      </button>
    </section>
  );
}

export default withRouter(Subscribe);
