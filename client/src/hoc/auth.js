import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authUser } from '../modules/user';

export default function (SpecificComponent, option, adminRoute = null) {
  // null(anybody access) | true (loggedin user only) | false (logout user only)

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      const fn = async () => {
        const res = await dispatch(authUser());
        console.log(res);

        if (!res.payload.isAuth) {
          // Loggedin user only page
          if (option) {
            props.history.push('/login');
          }
        } else {
          // Admin only page
          if (adminRoute && !res.payload.isAdmin) {
            props.history.push('/');
          } else {
            // Logged-out user only
            if (option === false) {
              props.history.push('/');
            }
          }
        }
      };
      fn();
    }, [dispatch, props.history]);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
