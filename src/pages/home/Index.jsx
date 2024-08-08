import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
const Index = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}</p>
        <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  )
}

export default Index
